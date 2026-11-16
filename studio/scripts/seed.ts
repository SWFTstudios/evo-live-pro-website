/**
 * Loads Tim's inventory, packages, pricing, services, gallery, team, FAQs and page text.
 * Port of scripts/seed.ts from the Payload build. Safe to run twice (deterministic IDs).
 *
 *   pnpm seed                                  seeds the "development" dataset
 *   SEED_RESET=true pnpm seed                  wipes seeded content (never inquiries) and reloads it
 *   SANITY_STUDIO_DATASET=production SEED_ALLOW_PRODUCTION=true pnpm seed    only if you mean it
 */
import {slugify} from '../lib/slugify'
import {
  CONTENT_TYPES,
  SINGLETON_TYPES,
  chunk,
  getClient,
  ref,
  resolveDataset,
  schemaDefaults,
} from './lib'
import {
  alaCarte,
  brands,
  capabilities,
  categoryOrder,
  equipment,
  eventServices,
  faqs,
  gallery,
  order,
  rentalPackages,
  timAnswers,
  weddingPackages,
} from './seedData'

type Doc = {_id: string; _type: string; [key: string]: unknown}

const dataset = resolveDataset('development', 'SEED_ALLOW_PRODUCTION')
const client = getClient(dataset)
const reset = process.env.SEED_RESET === 'true'

const docs: Doc[] = []
const seenIds = new Set<string>()

const add = (type: string, id: string, data: Record<string, unknown>) => {
  if (seenIds.has(id)) throw new Error(`Duplicate seed ID: ${id}. Two items slugify to the same value.`)
  seenIds.add(id)
  // Schema defaults first (Payload's defaultValue), then the seeded values on top.
  docs.push({...schemaDefaults(type), ...data, _id: id, _type: type})
}

// Categories and equipment
const categoryId = (name: string) => `equipmentCategory-${slugify(name)}`
categoryOrder.forEach((name, i) => {
  add('equipmentCategory', categoryId(name), {
    name,
    slug: {_type: 'slug', current: slugify(name)},
    sortOrder: order(i),
  })
})
equipment.forEach(([category, subcategory, name, description, priceLabel], i) => {
  if (!categoryOrder.includes(category)) throw new Error(`Unknown category "${category}" for ${name}`)
  add('equipment', `equipment-${slugify(name)}`, {
    name,
    category: ref(categoryId(category)),
    subcategory,
    description,
    priceLabel,
    available: true,
    sortOrder: order(i),
  })
})

rentalPackages.forEach(([name, guestsLabel, priceLabel, gear], i) => {
  add('rentalPackage', `rentalPackage-${slugify(name)}`, {name, guestsLabel, priceLabel, gear, sortOrder: order(i)})
})
weddingPackages.forEach(([name, guestsLabel, priceLabel, includes], i) => {
  add('weddingPackage', `weddingPackage-${slugify(name)}`, {
    name,
    guestsLabel,
    priceLabel,
    includes: [...includes],
    sortOrder: order(i),
  })
})
alaCarte.forEach(([name, priceLabel], i) => {
  add('alaCarteItem', `alaCarteItem-${slugify(name)}`, {name, priceLabel, sortOrder: order(i)})
})
eventServices.forEach(([title, description, ctaLabel, ctaLink, accent], i) => {
  add('eventService', `eventService-${slugify(title)}`, {
    title,
    description,
    ctaLabel,
    ctaLink,
    accent,
    sortOrder: order(i),
  })
})
gallery.forEach(([title, category, large, isVideo, featuredOnHome], i) => {
  add('galleryItem', `galleryItem-${slugify(title)}`, {
    title,
    category,
    large,
    isVideo,
    featuredOnHome,
    sortOrder: order(i),
  })
})
brands.forEach((name, i) => add('brand', `brand-${slugify(name)}`, {name, sortOrder: order(i)}))
faqs.forEach(([question, answer], i) =>
  add('faq', `faq-${i + 1}`, {question, answer, published: true, sortOrder: order(i)}),
)

// Team
const TIM = 'teamMember-timothy'
add('teamMember', TIM, {name: 'Timothy', jobTitle: 'Co-Founder & Creative Director', sortOrder: 10})
add('teamMember', 'teamMember-dominick', {
  name: 'Dominick',
  jobTitle: 'Co-Founder & Technical Operations',
  sortOrder: 20,
})

// Singletons: every field the schema has a default for, plus the seeded overrides.
add('siteSettings', 'siteSettings', {})
add('homePage', 'homePage', {})
add('contactPage', 'contactPage', {})
add('eventsPage', 'eventsPage', {
  capabilities: capabilities.map(([letter, title, description], i) => ({
    _key: `capability-${i}`,
    _type: 'capability',
    letter,
    title,
    description,
  })),
})
add('aboutPage', 'aboutPage', {
  originStory: [
    {
      _key: 'origin-0',
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _key: 'origin-0-span',
          _type: 'span',
          marks: [],
          text: 'Replace this with the Evo origin story: how Evo started in Lyndhurst, NJ, the first gig, and how it grew from DJ sets into full production.',
        },
      ],
    },
  ],
  offTheRecord: timAnswers.map(([question, answer], i) => ({
    _key: `qa-${i}`,
    _type: 'qa',
    question,
    answers: [{_key: `qa-${i}-a`, _type: 'qaAnswer', person: ref(TIM), answer}],
  })),
  threeWords: [],
})

const run = async () => {
  console.log(`Seeding dataset "${dataset}" (project ${client.config().projectId})${reset ? ' with RESET' : ''}`)

  if (reset) {
    const ids: string[] = await client.fetch(`*[_type in $types]._id`, {
      types: [...CONTENT_TYPES, ...SINGLETON_TYPES],
    })
    for (const batch of chunk(ids, 100)) {
      const tx = client.transaction()
      batch.forEach((id) => tx.delete(id))
      await tx.commit()
    }
    console.log(`Wiped ${ids.length} existing documents (inquiries untouched).`)
  }

  // createIfNotExists never overwrites an edit Tim made in the Studio.
  for (const batch of chunk(docs, 100)) {
    const tx = client.transaction()
    batch.forEach((doc) => tx.createIfNotExists(doc))
    await tx.commit()
  }

  // On an existing singleton, fill in only the fields that are missing (new fields since the last run).
  const patchTx = client.transaction()
  for (const doc of docs.filter((d) => (SINGLETON_TYPES as readonly string[]).includes(d._type))) {
    const {_id, _type, ...fields} = doc
    patchTx.patch(_id, (p) => p.setIfMissing(fields))
  }
  await patchTx.commit()

  const counts: Record<string, number> = await client.fetch(
    `{${[...CONTENT_TYPES, ...SINGLETON_TYPES].map((t) => `"${t}": count(*[_type == "${t}" && !(_id in path("drafts.**"))])`).join(', ')}}`,
  )
  console.table(counts)
  console.log(`Seed complete: ${docs.length} documents ensured.`)
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
