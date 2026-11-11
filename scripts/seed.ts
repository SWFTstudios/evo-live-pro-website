import { getPayload } from 'payload'
import config from '../src/payload.config'
import { slugify } from '../src/lib/slugify'

const Q = 'Price on quote'
const order = (i: number) => (i + 1) * 10

const equipment: [string, string, string, string, string][] = [
  ['Sound Systems', 'Point source', 'RCF ART 915A', '15" powered top', Q],
  ['Sound Systems', 'Point source', 'RCF NX 945-A', '15" powered top', Q],
  ['Sound Systems', 'Point source', 'AlphaTheta Wave-Eight', '8" portable speaker', Q],
  ['Sound Systems', 'Column array', 'RCF EVOX 12', 'Column array system, 15" sub', Q],
  ['Sound Systems', 'Column array', 'RCF EVOX J11 (White)', 'Active 3-way column, 12"', Q],
  ['Sound Systems', 'Column array', 'RCF EVOX J9', 'Active 3-way column, 12"', Q],
  ['Sound Systems', 'Line array', 'RCF HDL6-A', '1400W compact active line array', Q],
  ['Sound Systems', 'Subwoofer', 'RCF SUB 18-AX', '18" powered sub', Q],
  ['Sound Systems', 'Subwoofer', 'RCF SUB 8006-AS', 'Dual 18" powered sub', Q],
  ['Sound Systems', 'Wireless mics', 'Shure SLXD24D+/SM58', 'Dual handheld rack system', Q],
  ['Sound Systems', 'Wireless mics', 'Shure QLXD24/SM58', 'Dual handheld rack system', Q],
  ['Sound Systems', 'Wireless mics', 'Shure SM58', 'Wired vocal mic with switch', Q],
  ['Sound Systems', 'Mixers', 'Allen & Heath CQ-12T / CQ-18T', '12 or 18-channel digital', Q],
  ['Sound Systems', 'Mixers', 'Allen & Heath Qu-5D', '38-channel digital, Dante', Q],
  ['Visuals', 'LED video wall', 'LED Video Walls', "8'×4' · 14'×7' · 16.5'×9.5'", 'From $1,200'],
  ['Visuals', 'Screens', '50" / 55" Media Screens', 'On stands, truss or booth', 'From $250'],
  ['Lighting', 'Moving heads', '300W 3-in-1 Hybrid', 'Beam, spot and wash', Q],
  ['Lighting', 'Moving heads', '275W Beam', 'Sharp aerial beams', Q],
  ['Lighting', 'Moving heads', '19x15W LED Wash', 'Zoom with aura FX', Q],
  ['Lighting', 'Lasers', 'Unity Raw 5 FB4 RGB Lasers', 'With operator', '(2) $1,400'],
  ['Lighting', 'Stage lights', '350W Retro Hex', 'Signature hexagon look', '(2) $300'],
  ['Lighting', 'Stage lights', 'Strobes, Pars + Wash Bars', '260W strobes, 18x18W pars', Q],
  ['Lighting', 'Uplighting', 'Wireless Uplighting', 'Battery perimeter uplights', Q],
  ['Lighting', 'Control', 'ADJ Wolfmix W1 + WMX Wing', 'Standalone DMX control', Q],
  ['DJ Equipment', 'Players', 'Pioneer DJ CDJ-3000', 'Club-standard media player', Q],
  ['DJ Equipment', 'Players', 'AlphaTheta CDJ-3000X', 'Next-gen media player', Q],
  ['DJ Equipment', 'All-in-one', 'AlphaTheta XDJ-AZ', '4-channel DJ system', Q],
  ['DJ Equipment', 'Mixers', 'Pioneer DJ DJM-A9', '4-channel club mixer', Q],
  ['DJ Equipment', 'Mixers', 'Pioneer DJ DJM-S11', '2-channel battle mixer', Q],
  ['DJ Equipment', 'Booths', 'Portable DJ Booth', 'Black or white', Q],
  ['DJ Equipment', 'Booths', 'Humpter B3 Console', 'Fits a 50" media screen', Q],
  ['DJ Equipment', 'Booths', 'Custom TV DJ Booth', 'White with 65" screen', Q],
  ['DJ Equipment', 'Booths', 'Glorious Sessions Cube XL', 'Compact booth', Q],
  ['DJ Equipment', 'Booths', 'Custom Black Acrylic Facade', 'Clean front for any booth', Q],
  ['Staging', 'Stages', 'Stage Decks + Risers', "4'×8' to 16'×8'", 'From $175'],
  ['Staging', 'Stages', 'ProX StageQ', 'Adjustable 28"–48"', Q],
  ['Staging', 'Truss', 'ProX F34 Truss Towers', 'With 20"–32" base plates', Q],
  ['Special FX', 'Sparks', 'Cold Sparkular Machines', 'Indoor-safe, permit fee applies', '(2) $600'],
  ['Special FX', 'CO2', 'CO2 Stage Blaster Jets', 'With siphon tanks', '(2) $500'],
  ['Special FX', 'CO2', 'CO2 Handheld Cannon', 'Crowd-level blasts', '$350'],
  ['Special FX', 'Fog', 'Dancing on the Clouds', 'Chauvet Nimbus low fog', '$400'],
  ['Special FX', 'Fog', 'Water-Based Hazers', 'Makes beams visible', Q],
  ['Special FX', 'Extras', 'Confetti Cannons + Disco Balls', 'Disco balls 8"–30"', Q],
  ['Special FX', 'Photo booth', 'Salsa Digital Photo Booth', 'With attendant', Q],
  ['Power & Cable', 'Power', 'Power Distribution (Spider Boxes)', '20A / 30A / 50A feeders', Q],
  ['Power & Cable', 'Power', 'Jackery Power Stations', '300W–5000W, silent', Q],
  ['Power & Cable', 'Safety', 'Rubberized Cable Ramps', 'Heavy-duty crossings', Q],
  ['Production Crew', 'Audio', 'A1 / A2 Audio Engineers', 'Sound technicians', Q],
  ['Production Crew', 'Lighting', 'Lighting Director + Laser Op', 'Lighting and FX design', Q],
  ['Production Crew', 'Stage', 'Stagehands + Rigging Crew', 'Setup and breakdown', Q],
  ['Production Crew', 'Media', 'Content Creator', 'Photo, video, recap reels', '$850+'],
]

const categoryOrder = [
  'Sound Systems',
  'Visuals',
  'Lighting',
  'Staging',
  'DJ Equipment',
  'Special FX',
  'Power & Cable',
  'Production Crew',
]

const rentalPackages = [
  ['Small Room', 'Up to 100 guests', '$1,000+', 'Portable DJ booth, RCF EVOX J9 column array, AlphaTheta XDJ-AZ, stagehand.'],
  ['Medium Room', 'Up to 150 guests', '$1,600+', 'Humpter B3 console, (2) CDJ-3000, DJM-A9, CQ-12T, Shure wireless, RCF EVOX 12, stagehand, A1 engineer.'],
  ['Large Room', 'Up to 300 guests', '$2,200+', 'Acrylic facade on StageQ, (2) RCF NX 945-A, (2) SUB 18-AX, (2) CDJ-3000, DJM-A9, wireless, 2 stagehands, A1.'],
  ['Huge Room', '800+ guests', '$3,000+', '(8) RCF HDL6-A line array, (2) SUB 8006-AS, (2) CDJ-3000, DJM-A9, CQ-18T, wireless, 3 stagehands, A1.'],
]

const weddingPackages = [
  ['The Architectural Essentials', 'Up to 150 guests', '$5,500', ['Custom DJ furniture', '(2) intelligent lights', '(12) wireless uplights', 'High-end sound system', 'Lead DJ/MC, secondary DJ, production tech']],
  ['The Elevated Design Experience', 'Up to 250 guests', '$8,500', ['Custom DJ furniture', '(4) intelligent lights, (18) uplights', 'Digital photo booth + attendant', 'FX: (2) cold sparks or Dancing on the Clouds', 'Lead DJ/MC, secondary DJ']],
  ['The Nightlife Reserve', 'Up to 350 guests', '$12,500', ['DJ furniture with media screen', '(6) intelligent lights, (24) uplights', 'FX suite: CO2 cannons, CO2 jets, (4) cold sparks', 'Concert-level sound', 'Lighting director, content creator, production techs']],
  ['The Bespoke Production Reserve', 'No limit', '$22,500+', ['Custom modular LED video wall', 'Tailored stage build, (8) intelligent lights', 'Full FX: lasers, CO2, cold sparks, low fog', 'RCF line array system', 'Master LD, VJ, audio tech, content creator, photo booth']],
] as const

const alaCarte: [string, string][] = [
  ['Ceremony', '$800'],
  ['Cocktail hour', '$700'],
  ['Ceremony + cocktail bundle', '$1,300'],
  ['After party DJ', '$1,000+'],
  ['(2) Retro hexagons', '$300'],
  ['(2) Lasers + operator', '$1,400'],
  ['(2) CO2 jets', '$500'],
  ['Handheld CO2 cannon', '$350'],
  ['Dancing on the Clouds', '$400'],
  ['(2) Cold sparks + permit', '$600'],
  ['Media screens', '$250'],
  ['Content creator', '$850+'],
  ["Video wall 8'×4'", '$1,200'],
  ["Video wall 14'×7'", '$3,400'],
  ["Video wall 16.5'×9.5'", '$5,500'],
  ['Travel', 'TBD'],
]

const eventServices = [
  ['Weddings', 'Ceremony, cocktail hour and a reception that stays packed. Packages from $5,500.', 'See packages →', '#packages', 'book'],
  ['Corporate Events', 'Keynotes, launches and parties for brands like Nike, EY and PwC.', 'Plan a corporate event →', '/contact', 'book'],
  ['Concerts & Live Events', 'Line arrays, lasers, CO2 and LED walls for headliners and festival stages.', 'Produce a show →', '/contact', 'book'],
  ['Private Parties', 'Birthdays, milestones and house parties with a club-level setup.', 'Book a party →', '/contact', 'book'],
  ['Rentals', 'Just need the gear? Rent our sound, lighting, video, staging, DJ and FX equipment.', 'Browse rentals →', '/rentals', 'rent'],
] as const

const gallery = [
  ['The Graziano Wedding', 'weddings', true, true, true],
  ['The Lam Wedding', 'weddings', false, false, true],
  ['Tim & Dom', 'behind-the-scenes', false, true, false],
  ['The Sullivan Wedding', 'weddings', false, false, true],
] as const

const brands = [
  'TKO Group Holdings', 'EY', 'PwC', 'Nike', 'NBA', 'Carl Friedrik',
  'Zocdoc', 'KBRA', 'EQT', 'Related Fund Management', 'Zeta Global', 'Diameter Capital',
]

const capabilities = [
  ['A', 'Audio', 'RCF line arrays, columns and subs, Shure wireless, Allen & Heath mixing'],
  ['D', 'DJ', 'Lead DJ/MC, secondary DJ, CDJ-3000s, DJM-A9 and custom booths'],
  ['L', 'Lighting', 'Intelligent moving heads, lasers, retro hexagons, uplighting and a lighting director'],
  ['S', 'Staging & Rigging', 'Stage decks, ProX truss towers, power distribution and cable safety'],
  ['V', 'Video & LED Walls', "Modular LED walls up to 16.5'×9.5', media screens and a VJ"],
] as const

const timAnswers: [string, string][] = [
  ['When you’re not running events, you can find us…', 'Spending unnecessary money on cars, collectibles and gear.'],
  ['The piece of gear you’ll never leave the warehouse without', 'Gaff tape.'],
  ['Worst production trend?', 'Tube lights. Can be cool, but overdone.'],
  ['Favorite production element to flex on a stage', 'BRING OUT THE LASERS.'],
  ['Top genres you listen to', 'EDM, Hip Hop, Alternative Rock, R&B'],
  ['Go-to track to test on a rig', 'Honestly, any Knock2.'],
]

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  format: '' as const,
  indent: 0,
  direction: 'ltr' as const,
  children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
})
const richText = (paragraphs: string[]) => ({
  root: { type: 'root', version: 1, format: '' as const, indent: 0, direction: 'ltr' as const, children: paragraphs.map(paragraph) },
})

const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'equipment-categories' })
  if (existing.totalDocs > 0 && process.env.SEED_RESET !== 'true') {
    payload.logger.info('Content already exists. Skipping seed. Set SEED_RESET=true to wipe and reseed.')
    process.exit(0)
  }

  if (process.env.SEED_RESET === 'true') {
    for (const collection of [
      'equipment', 'equipment-categories', 'rental-packages', 'wedding-packages', 'a-la-carte',
      'event-services', 'gallery', 'team', 'brands', 'venues',
    ] as const) {
      await payload.delete({ collection, where: { id: { exists: true } } })
    }
    payload.logger.info('Wiped existing content.')
  }

  const categoryIds = new Map<string, number>()
  for (const [i, name] of categoryOrder.entries()) {
    const doc = await payload.create({
      collection: 'equipment-categories',
      data: { name, slug: slugify(name), sortOrder: order(i) },
    })
    categoryIds.set(name, doc.id)
  }

  for (const [i, [category, subcategory, name, description, priceLabel]] of equipment.entries()) {
    await payload.create({
      collection: 'equipment',
      data: {
        name,
        category: categoryIds.get(category)!,
        subcategory,
        description,
        priceLabel,
        available: true,
        sortOrder: order(i),
      },
    })
  }

  for (const [i, [name, guestsLabel, priceLabel, gear]] of rentalPackages.entries()) {
    await payload.create({ collection: 'rental-packages', data: { name, guestsLabel, priceLabel, gear, sortOrder: order(i) } })
  }

  for (const [i, [name, guestsLabel, priceLabel, includes]] of weddingPackages.entries()) {
    await payload.create({
      collection: 'wedding-packages',
      data: { name, guestsLabel, priceLabel, includes: includes.map((item) => ({ item })), sortOrder: order(i) },
    })
  }

  for (const [i, [name, priceLabel]] of alaCarte.entries()) {
    await payload.create({ collection: 'a-la-carte', data: { name, priceLabel, sortOrder: order(i) } })
  }

  for (const [i, [title, description, ctaLabel, ctaLink, accent]] of eventServices.entries()) {
    await payload.create({
      collection: 'event-services',
      data: { title, description, ctaLabel, ctaLink, accent, sortOrder: order(i) },
    })
  }

  for (const [i, [title, category, large, isVideo, featuredOnHome]] of gallery.entries()) {
    await payload.create({
      collection: 'gallery',
      data: { title, category, large, isVideo, featuredOnHome, sortOrder: order(i) },
    })
  }

  for (const [i, name] of brands.entries()) {
    await payload.create({ collection: 'brands', data: { name, sortOrder: order(i) } })
  }

  const tim = await payload.create({
    collection: 'team',
    data: { name: 'Timothy', jobTitle: 'Co-Founder & Creative Director', sortOrder: 10 },
  })
  await payload.create({
    collection: 'team',
    data: { name: 'Dominick', jobTitle: 'Co-Founder & Technical Operations', sortOrder: 20 },
  })

  await payload.updateGlobal({ slug: 'site-settings', data: {} })
  await payload.updateGlobal({ slug: 'home-page', data: {} })
  await payload.updateGlobal({ slug: 'contact-page', data: {} })
  await payload.updateGlobal({
    slug: 'events-page',
    data: { capabilities: capabilities.map(([letter, title, description]) => ({ letter, title, description })) },
  })
  await payload.updateGlobal({
    slug: 'about-page',
    data: {
      originStory: richText([
        'Replace this with the Evo origin story: how Evo started in Lyndhurst, NJ, the first gig, and how it grew from DJ sets into full production.',
      ]),
      offTheRecord: timAnswers.map(([question, answer]) => ({
        question,
        answers: [{ person: tim.id, answer }],
      })),
      threeWords: [],
    },
  })

  payload.logger.info('Seed complete: inventory, packages, pricing, services, gallery, team and page text loaded.')
  process.exit(0)
}

await run()
