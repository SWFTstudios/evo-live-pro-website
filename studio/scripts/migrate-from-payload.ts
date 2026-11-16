/**
 * Copies the real content (and uploaded files) from the live Payload site into Sanity.
 *
 *   PAYLOAD_URL=https://evo-live-pro-website.elombe.workers.dev \
 *   PAYLOAD_EMAIL=... PAYLOAD_PASSWORD=... \
 *   SANITY_STUDIO_DATASET=development \
 *   pnpm migrate
 *
 * - Run against "development" first. "production" needs MIGRATE_ALLOW_PRODUCTION=true.
 * - MIGRATE_DRY_RUN=true transforms everything and prints the reconciliation, but uploads and writes nothing.
 * - Raw exports go to studio/.migration/<slug>.json (git-ignored; MIGRATE_DIR overrides the folder). An existing file is reused, so a failed
 *   run resumes and you can inspect or hand-edit the export. MIGRATE_REFETCH=true downloads it again.
 * - Safe to run again: IDs are deterministic and documents are replaced, so nothing doubles.
 * - Needs an ADMIN Payload account, because Inquiries are not publicly readable.
 */
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs'
import {join} from 'node:path'
import {slugify} from '../lib/slugify'
import {chunk, fieldNames, getClient, ref, resolveDataset, schemaDefaults, strip} from './lib'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rec = Record<string, any>

const dataset = resolveDataset(null, 'MIGRATE_ALLOW_PRODUCTION')
const dryRun = process.env.MIGRATE_DRY_RUN === 'true'
const client = getClient(dataset)
const DIR = process.env.MIGRATE_DIR || join(process.cwd(), '.migration')
mkdirSync(DIR, {recursive: true})

const COLLECTIONS = [
  'equipment-categories',
  'equipment',
  'rental-packages',
  'wedding-packages',
  'a-la-carte',
  'event-services',
  'team',
  'brands',
  'venues',
  'testimonials',
  'faqs',
  'gallery',
  'inquiries',
  'media',
] as const
const GLOBALS = ['site-settings', 'home-page', 'about-page', 'events-page', 'contact-page'] as const

const warnings: string[] = []
const warn = (message: string) => {
  warnings.push(message)
  console.warn(`  ! ${message}`)
}

// ---------------------------------------------------------------- 1. Export from Payload

const file = (name: string) => join(DIR, `${name}.json`)
const readCache = (name: string): Rec | undefined =>
  existsSync(file(name)) && process.env.MIGRATE_REFETCH !== 'true'
    ? JSON.parse(readFileSync(file(name), 'utf8'))
    : undefined

let jwt: string | undefined
const payloadFetch = async (path: string): Promise<Rec> => {
  const base = process.env.PAYLOAD_URL?.replace(/\/+$/, '')
  if (!base) throw new Error('Set PAYLOAD_URL (the live Payload site), or provide cached files in studio/.migration/.')
  if (!jwt) {
    const {PAYLOAD_EMAIL: email, PAYLOAD_PASSWORD: password} = process.env
    if (!email || !password) throw new Error('Set PAYLOAD_EMAIL and PAYLOAD_PASSWORD (an admin account).')
    const login = await fetch(`${base}/api/users/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email, password}),
    })
    if (!login.ok) throw new Error(`Payload login failed (${login.status}). Check the email and password.`)
    jwt = ((await login.json()) as Rec).token
    if (!jwt) throw new Error('Payload login returned no token.')
  }
  const response = await fetch(`${base}${path}`, {headers: {Authorization: `JWT ${jwt}`}})
  if (!response.ok) throw new Error(`GET ${path} failed (${response.status})`)
  return (await response.json()) as Rec
}

const exported: Record<string, Rec[]> = {}
const globalsData: Record<string, Rec> = {}

const exportAll = async () => {
  for (const slug of COLLECTIONS) {
    let json = readCache(slug)
    if (!json) {
      json = await payloadFetch(`/api/${slug}?depth=0&limit=0&pagination=false`)
      writeFileSync(file(slug), JSON.stringify(json, null, 2))
    }
    exported[slug] = json.docs ?? []
    console.log(`  exported ${String(exported[slug].length).padStart(3)}  ${slug}`)
  }
  for (const slug of GLOBALS) {
    let json = readCache(`global-${slug}`)
    if (!json) {
      json = await payloadFetch(`/api/globals/${slug}?depth=0`)
      writeFileSync(file(`global-${slug}`), JSON.stringify(json, null, 2))
    }
    globalsData[slug] = json
    console.log(`  exported global  ${slug}`)
  }
}

// ---------------------------------------------------------------- 2. Media

type MediaEntry = {assetId: string; alt: string; isVideo: boolean}
let mediaMap: Record<string, MediaEntry> = {}

const uploadMedia = async () => {
  const mapFile = file('media-map')
  if (existsSync(mapFile) && !dryRun) mediaMap = JSON.parse(readFileSync(mapFile, 'utf8'))
  const base = process.env.PAYLOAD_URL?.replace(/\/+$/, '')
  let uploaded = 0
  for (const media of exported.media) {
    const key = String(media.id)
    const isVideo = String(media.mimeType ?? '').startsWith('video/')
    if (dryRun) {
      mediaMap[key] = {assetId: `${isVideo ? 'file' : 'image'}-dryrun-${key}`, alt: media.alt ?? '', isVideo}
      continue
    }
    if (mediaMap[key]) continue
    if (!base) throw new Error('Set PAYLOAD_URL to download media.')
    if (!media.url) {
      warn(`media ${key} (${media.filename}) has no url, skipped`)
      continue
    }
    const response = await fetch(new URL(media.url, base))
    if (!response.ok) {
      warn(`media ${key} (${media.filename}): download failed (${response.status}), skipped`)
      continue
    }
    const asset = await client.assets.upload(isVideo ? 'file' : 'image', Buffer.from(await response.arrayBuffer()), {
      filename: media.filename,
      contentType: media.mimeType,
    })
    mediaMap[key] = {assetId: asset._id, alt: media.alt ?? '', isVideo}
    writeFileSync(mapFile, JSON.stringify(mediaMap, null, 2))
    uploaded++
  }
  console.log(`  media: ${exported.media.length} in Payload, ${uploaded} uploaded this run, ${Object.keys(mediaMap).length} mapped`)
}

const idOf = (value: unknown): string | undefined =>
  value == null ? undefined : String(typeof value === 'object' ? (value as Rec).id : value)

const image = (value: unknown, where: string) => {
  const id = idOf(value)
  if (!id) return undefined
  const media = mediaMap[id]
  if (!media) return void warn(`${where}: media ${id} was not migrated`)
  if (media.isVideo) return void warn(`${where}: expected an image but media ${id} is a video`)
  return {_type: 'mediaImage', alt: media.alt || 'Image', asset: ref(media.assetId)}
}

const video = (value: unknown, where: string) => {
  const id = idOf(value)
  if (!id) return undefined
  const media = mediaMap[id]
  if (!media) return void warn(`${where}: media ${id} was not migrated`)
  if (!media.isVideo) return void warn(`${where}: expected a video but media ${id} is an image`)
  return {_type: 'videoFile', alt: media.alt || undefined, asset: ref(media.assetId)}
}

// ---------------------------------------------------------------- 3. Lexical -> Portable Text

const BOLD = 1
const ITALIC = 2

export const lexicalToPortableText = (value: Rec | null | undefined, where: string): Rec[] => {
  const blocks: Rec[] = []
  for (const [bi, node] of (value?.root?.children ?? []).entries() as Iterable<[number, Rec]>) {
    if (node.type !== 'paragraph' && node.type !== 'heading') {
      throw new Error(`Unsupported rich text node "${node.type}" in ${where}. Add support in lexicalToPortableText, or edit the export.`)
    }
    const markDefs: Rec[] = []
    const children: Rec[] = []
    const pushText = (text: string, format: number, linkKey?: string) => {
      const marks: string[] = []
      if (format & BOLD) marks.push('strong')
      if (format & ITALIC) marks.push('em')
      if (format & ~(BOLD | ITALIC)) warn(`${where}: dropped unsupported text formatting (underline, strikethrough or code)`)
      if (linkKey) marks.push(linkKey)
      children.push({_key: `b${bi}-s${children.length}`, _type: 'span', text, marks})
    }
    for (const child of (node.children ?? []) as Rec[]) {
      if (child.type === 'text') pushText(child.text ?? '', Number(child.format) || 0)
      else if (child.type === 'linebreak') pushText('\n', 0)
      else if (child.type === 'link' || child.type === 'autolink') {
        const key = `b${bi}-l${markDefs.length}`
        markDefs.push({_key: key, _type: 'link', href: child.fields?.url ?? child.url ?? ''})
        for (const inner of (child.children ?? []) as Rec[]) {
          if (inner.type !== 'text') throw new Error(`Unsupported node "${inner.type}" inside a link in ${where}`)
          pushText(inner.text ?? '', Number(inner.format) || 0, key)
        }
      } else throw new Error(`Unsupported inline node "${child.type}" in ${where}`)
    }
    if (children.every((c) => !c.text)) continue // empty paragraph
    blocks.push({_key: `b${bi}`, _type: 'block', style: node.type === 'heading' ? 'h3' : 'normal', markDefs, children})
  }
  return blocks
}

// ---------------------------------------------------------------- 4. Transform

type Out = {_id: string; _type: string; [key: string]: unknown}

/** Whitelist by schema field names, apply schema defaults only to keys Payload didn't have, drop nulls. */
const finish = (type: string, id: string, data: Rec): Out => {
  const names = fieldNames(type)
  const picked: Rec = {}
  for (const name of names) if (name in data) picked[name] = data[name]
  const defaults = schemaDefaults(type)
  const merged: Rec = {...Object.fromEntries(Object.entries(defaults).filter(([k]) => !(k in picked))), ...picked}
  return {...strip(merged), _id: id, _type: type}
}

const keyed = (type: string, rows: Rec[] | null | undefined) =>
  (rows ?? []).map((row, i) => ({_key: `${type}-${i}`, _type: type, ...row}))
const strings = (rows: Rec[] | null | undefined, key: string) => (rows ?? []).map((r) => r[key]).filter(Boolean)

const sanityId = (type: string, payloadId: unknown) => `${type}-${payloadId}`

const transformAll = (): Out[] => {
  const out: Out[] = []
  const each = (slug: string, type: string, fn: (doc: Rec, where: string) => Rec) => {
    for (const doc of exported[slug]) out.push(finish(type, sanityId(type, doc.id), fn(doc, `${slug} #${doc.id}`)))
  }

  each('equipment-categories', 'equipmentCategory', (d) => ({
    ...d,
    slug: {_type: 'slug', current: d.slug || slugify(d.name)},
  }))
  each('equipment', 'equipment', (d, w) => ({
    ...d,
    category: d.category == null ? undefined : ref(sanityId('equipmentCategory', idOf(d.category))),
    image: image(d.image, w),
  }))
  each('rental-packages', 'rentalPackage', (d) => d)
  each('wedding-packages', 'weddingPackage', (d) => ({...d, includes: strings(d.includes, 'item')}))
  each('a-la-carte', 'alaCarteItem', (d) => d)
  each('event-services', 'eventService', (d, w) => ({...d, image: image(d.image, w)}))
  each('team', 'teamMember', (d, w) => ({...d, portrait: image(d.portrait, w)}))
  each('brands', 'brand', (d, w) => ({...d, logo: image(d.logo, w)}))
  each('venues', 'venue', (d) => d)
  each('testimonials', 'testimonial', (d, w) => ({...d, photo: image(d.photo, w)}))
  each('faqs', 'faq', (d) => d)
  each('gallery', 'galleryItem', (d, w) => {
    const media = mediaMap[idOf(d.media) ?? '']
    return {
      ...d,
      image: media && !media.isVideo ? image(d.media, w) : undefined,
      video: media?.isVideo ? video(d.media, w) : undefined,
      isVideo: Boolean(d.isVideo || media?.isVideo),
    }
  })

  // Inquiries: an ID containing a dot is not publicly readable, which keeps customer details private.
  for (const d of exported.inquiries) {
    out.push(finish('inquiry', `inquiry.payload-${d.id}`, {...d, submittedAt: d.createdAt}))
  }

  const g = globalsData
  out.push(
    finish('siteSettings', 'siteSettings', {
      ...g['site-settings'],
      logoWordmark: image(g['site-settings'].logoWordmark, 'site-settings logoWordmark'),
      logoMark: image(g['site-settings'].logoMark, 'site-settings logoMark'),
      shareImage: image(g['site-settings'].shareImage, 'site-settings shareImage'),
      navigation: keyed(
        'navLink',
        (g['site-settings'].navigation ?? []).map((n: Rec) => ({label: n.label, url: n.url})),
      ),
    }),
    finish('homePage', 'homePage', {
      ...g['home-page'],
      heroVideo: video(g['home-page'].heroVideo, 'home-page heroVideo'),
      heroImage: image(g['home-page'].heroImage, 'home-page heroImage'),
      trustBadges: strings(g['home-page'].trustBadges, 'text'),
      services: keyed(
        'serviceCard',
        (g['home-page'].services ?? []).map((s: Rec, i: number) => ({
          title: s.title,
          description: s.description,
          image: image(s.image, `home-page services[${i}]`),
        })),
      ),
      howSteps: keyed(
        'howStep',
        (g['home-page'].howSteps ?? []).map((s: Rec) => ({title: s.title, text: s.text})),
      ),
    }),
    finish('aboutPage', 'aboutPage', {
      ...g['about-page'],
      originStory: g['about-page'].originStory ? lexicalToPortableText(g['about-page'].originStory, 'about-page originStory') : undefined,
      groupPhoto: image(g['about-page'].groupPhoto, 'about-page groupPhoto'),
      offTheRecord: keyed(
        'qa',
        (g['about-page'].offTheRecord ?? []).map((q: Rec, qi: number) => ({
          question: q.question,
          answers: (q.answers ?? []).map((a: Rec, ai: number) => ({
            _key: `qa-${qi}-a${ai}`,
            _type: 'qaAnswer',
            person: ref(sanityId('teamMember', idOf(a.person))),
            answer: a.answer,
          })),
        })),
      ),
      threeWords: strings(g['about-page'].threeWords, 'word'),
    }),
    finish('eventsPage', 'eventsPage', {
      ...g['events-page'],
      capabilities: keyed(
        'capability',
        (g['events-page'].capabilities ?? []).map((c: Rec) => ({letter: c.letter, title: c.title, description: c.description})),
      ),
    }),
    finish('contactPage', 'contactPage', {
      ...g['contact-page'],
      eventTypes: strings(g['contact-page'].eventTypes, 'value'),
      budgetRanges: strings(g['contact-page'].budgetRanges, 'value'),
      fulfillmentOptions: strings(g['contact-page'].fulfillmentOptions, 'value'),
      sidePhoto: image(g['contact-page'].sidePhoto, 'contact-page sidePhoto'),
    }),
  )
  return out
}

// ---------------------------------------------------------------- 5. Write + reconcile

const PAYLOAD_TO_TYPE: Record<string, string> = {
  'equipment-categories': 'equipmentCategory',
  equipment: 'equipment',
  'rental-packages': 'rentalPackage',
  'wedding-packages': 'weddingPackage',
  'a-la-carte': 'alaCarteItem',
  'event-services': 'eventService',
  team: 'teamMember',
  brands: 'brand',
  venues: 'venue',
  testimonials: 'testimonial',
  faqs: 'faq',
  gallery: 'galleryItem',
  inquiries: 'inquiry',
}

const run = async () => {
  console.log(`Migrating Payload -> Sanity dataset "${dataset}"${dryRun ? ' (DRY RUN)' : ''}`)
  console.log('1/4 Exporting from Payload')
  await exportAll()
  console.log('2/4 Media')
  await uploadMedia()
  console.log('3/4 Transforming')
  const docs = transformAll()

  writeFileSync(file('transformed').replace(/\.json$/, '.ndjson'), docs.map((d) => JSON.stringify(d)).join('\n') + '\n')
  console.log(`4/4 ${dryRun ? 'Skipping writes' : 'Writing'} (${docs.length} documents)`)
  if (!dryRun) {
    for (const batch of chunk(docs, 100)) {
      const tx = client.transaction()
      batch.forEach((doc) => tx.createOrReplace(doc))
      await tx.commit()
    }
  }

  // Reconciliation: Payload count vs what is in (or would be written to) Sanity.
  const rows: Record<string, {payload: number; sanity: number; ok: string}> = {}
  let mismatch = false
  for (const [slug, type] of Object.entries(PAYLOAD_TO_TYPE)) {
    const payloadCount = exported[slug].length
    const sanityCount = dryRun
      ? docs.filter((d) => d._type === type).length
      : await client.fetch(`count(*[_type == $type && !(_id in path("drafts.**"))])`, {type})
    const ok = payloadCount === sanityCount
    if (!ok) mismatch = true
    rows[slug] = {payload: payloadCount, sanity: sanityCount, ok: ok ? 'yes' : 'NO'}
  }
  const migratedMedia = Object.keys(mediaMap).length
  rows.media = {payload: exported.media.length, sanity: migratedMedia, ok: exported.media.length === migratedMedia ? 'yes' : 'NO'}
  if (rows.media.ok === 'NO') mismatch = true
  for (const type of ['siteSettings', 'homePage', 'aboutPage', 'eventsPage', 'contactPage']) {
    const found = docs.some((d) => d._id === type)
    rows[type] = {payload: 1, sanity: found ? 1 : 0, ok: found ? 'yes' : 'NO'}
    if (!found) mismatch = true
  }
  console.table(rows)
  if (warnings.length) console.log(`${warnings.length} warning(s) above. Review them before cutover.`)
  if (mismatch) {
    console.error('Reconciliation FAILED: counts do not match.')
    process.exit(1)
  }
  console.log('Reconciliation passed.')
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
