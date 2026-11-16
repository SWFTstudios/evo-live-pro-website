// Copied verbatim from the Payload seed (scripts/seed.ts on feat/payload-cms). Do not retype prices by hand.
export const Q = 'Price on quote'
export const order = (i: number) => (i + 1) * 10

export const equipment: [string, string, string, string, string][] = [
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

export const categoryOrder = [
  'Sound Systems',
  'Visuals',
  'Lighting',
  'Staging',
  'DJ Equipment',
  'Special FX',
  'Power & Cable',
  'Production Crew',
]

export const rentalPackages = [
  ['Small Room', 'Up to 100 guests', '$1,000+', 'Portable DJ booth, RCF EVOX J9 column array, AlphaTheta XDJ-AZ, stagehand.'],
  ['Medium Room', 'Up to 150 guests', '$1,600+', 'Humpter B3 console, (2) CDJ-3000, DJM-A9, CQ-12T, Shure wireless, RCF EVOX 12, stagehand, A1 engineer.'],
  ['Large Room', 'Up to 300 guests', '$2,200+', 'Acrylic facade on StageQ, (2) RCF NX 945-A, (2) SUB 18-AX, (2) CDJ-3000, DJM-A9, wireless, 2 stagehands, A1.'],
  ['Huge Room', '800+ guests', '$3,000+', '(8) RCF HDL6-A line array, (2) SUB 8006-AS, (2) CDJ-3000, DJM-A9, CQ-18T, wireless, 3 stagehands, A1.'],
]

export const weddingPackages = [
  ['The Architectural Essentials', 'Up to 150 guests', '$5,500', ['Custom DJ furniture', '(2) intelligent lights', '(12) wireless uplights', 'High-end sound system', 'Lead DJ/MC, secondary DJ, production tech']],
  ['The Elevated Design Experience', 'Up to 250 guests', '$8,500', ['Custom DJ furniture', '(4) intelligent lights, (18) uplights', 'Digital photo booth + attendant', 'FX: (2) cold sparks or Dancing on the Clouds', 'Lead DJ/MC, secondary DJ']],
  ['The Nightlife Reserve', 'Up to 350 guests', '$12,500', ['DJ furniture with media screen', '(6) intelligent lights, (24) uplights', 'FX suite: CO2 cannons, CO2 jets, (4) cold sparks', 'Concert-level sound', 'Lighting director, content creator, production techs']],
  ['The Bespoke Production Reserve', 'No limit', '$22,500+', ['Custom modular LED video wall', 'Tailored stage build, (8) intelligent lights', 'Full FX: lasers, CO2, cold sparks, low fog', 'RCF line array system', 'Master LD, VJ, audio tech, content creator, photo booth']],
] as const

export const alaCarte: [string, string][] = [
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

export const eventServices = [
  ['Weddings', 'Ceremony, cocktail hour and a reception that stays packed. Packages from $5,500.', 'See packages →', '#packages', 'book'],
  ['Corporate Events', 'Keynotes, launches and parties for brands like Nike, EY and PwC.', 'Plan a corporate event →', '/contact', 'book'],
  ['Concerts & Live Events', 'Line arrays, lasers, CO2 and LED walls for headliners and festival stages.', 'Produce a show →', '/contact', 'book'],
  ['Private Parties', 'Birthdays, milestones and house parties with a club-level setup.', 'Book a party →', '/contact', 'book'],
  ['Rentals', 'Just need the gear? Rent our sound, lighting, video, staging, DJ and FX equipment.', 'Browse rentals →', '/rentals', 'rent'],
] as const

export const gallery = [
  ['The Graziano Wedding', 'weddings', true, true, true],
  ['The Lam Wedding', 'weddings', false, false, true],
  ['Tim & Dom', 'behind-the-scenes', false, true, false],
  ['The Sullivan Wedding', 'weddings', false, false, true],
] as const

export const brands = [
  'TKO Group Holdings', 'EY', 'PwC', 'Nike', 'NBA', 'Carl Friedrik',
  'Zocdoc', 'KBRA', 'EQT', 'Related Fund Management', 'Zeta Global', 'Diameter Capital',
]

export const capabilities = [
  ['A', 'Audio', 'RCF line arrays, columns and subs, Shure wireless, Allen & Heath mixing'],
  ['D', 'DJ', 'Lead DJ/MC, secondary DJ, CDJ-3000s, DJM-A9 and custom booths'],
  ['L', 'Lighting', 'Intelligent moving heads, lasers, retro hexagons, uplighting and a lighting director'],
  ['S', 'Staging & Rigging', 'Stage decks, ProX truss towers, power distribution and cable safety'],
  ['V', 'Video & LED Walls', "Modular LED walls up to 16.5'×9.5', media screens and a VJ"],
] as const

export const timAnswers: [string, string][] = [
  ['When you’re not running events, you can find us…', 'Spending unnecessary money on cars, collectibles and gear.'],
  ['The piece of gear you’ll never leave the warehouse without', 'Gaff tape.'],
  ['Worst production trend?', 'Tube lights. Can be cool, but overdone.'],
  ['Favorite production element to flex on a stage', 'BRING OUT THE LASERS.'],
  ['Top genres you listen to', 'EDM, Hip Hop, Alternative Rock, R&B'],
  ['Go-to track to test on a rig', 'Honestly, any Knock2.'],
]

// Only facts already stated on the site. Tim can edit or add more in the dashboard.
export const faqs: [string, string][] = [
  ['Do you deliver and set up the gear?', 'Yes. Choose delivery with setup, delivery only, or pick up from our warehouse in Lyndhurst, NJ.'],
  ['How do I get a price?', 'Add what you need to your quote on the Rentals page, or send a booking request. Many items are priced on quote, so we confirm availability for your date and send you a price.'],
  ['What do the wedding packages include?', 'Every wedding package includes a 4-hour reception, an online playlist tool and planning consultations. Prices are plus applicable tax.'],
  ['Are cold sparks safe indoors?', 'Yes. Our cold spark machines are indoor-safe. A permit fee applies.'],
  ['Do you work with venues and planners?', 'Yes. We rent to planners, venues, DJs and production teams, and we do full production installs for venues, offices and lounges.'],
]

export const howSteps = [
  { title: 'Tell us the date', text: 'Pick Book Evo or Rent gear and send the details. It takes about two minutes.' },
  { title: 'We design the setup', text: 'We confirm availability and come back with a plan and a price for your night.' },
  { title: 'We run the night', text: 'We load in, run the show and break it all down. You enjoy your event.' },
]
