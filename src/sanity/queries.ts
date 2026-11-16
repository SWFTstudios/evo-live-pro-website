// GROQ queries. Each returns the same shapes the pages used with Payload (an `id`, media as
// { url, alt, isVideo }), so the markup in the pages barely changes.
//
// Images come from Sanity's image CDN, resized with `?w=` and served in the best format (`auto=format`).
// Crop and hotspot are not applied yet (the pages use CSS object-fit); see docs/sanity-migration-plan.md.

const image = (field: string, width = 1600) =>
  `${field}{ "url": asset->url + "?w=${width}&auto=format&fit=max", alt, "isVideo": false }`
const video = (field: string) => `${field}{ "url": asset->url, alt, "isVideo": true }`

const SETTINGS = `*[_id == "siteSettings"][0]{
  ...,
  ${image('logoWordmark', 600)},
  ${image('logoMark', 256)},
  ${image('shareImage', 1200)}
}`

const GALLERY_MEDIA = `"media": coalesce(${video('video')}, ${image('image')})`

export const settingsQuery = SETTINGS

export const homeQuery = `{
  "home": *[_id == "homePage"][0]{
    ...,
    ${video('heroVideo')},
    ${image('heroImage', 2000)},
    services[]{ ..., ${image('image', 1200)} }
  },
  "settings": ${SETTINGS},
  "featured": *[_type == "galleryItem" && featuredOnHome == true] | order(sortOrder asc)[0...8]{
    "id": _id, title, category, large, ${GALLERY_MEDIA}
  },
  "brands": *[_type == "brand"] | order(sortOrder asc)[0...60]{ "id": _id, name, ${image('logo', 400)} },
  "faqs": *[_type == "faq" && published != false] | order(sortOrder asc)[0...20]{ "id": _id, question, answer },
  "testimonials": *[_type == "testimonial" && published != false] | order(sortOrder asc)[0...6]{
    "id": _id, quote, name, eventType
  }
}`

export const rentalsQuery = `{
  "categories": *[_type == "equipmentCategory"] | order(sortOrder asc)[0...50]{ name },
  "equipment": *[_type == "equipment" && available != false] | order(sortOrder asc)[0...500]{
    "id": _id,
    name,
    "category": coalesce(category->name, "Other"),
    "subcategory": coalesce(subcategory, ""),
    "description": coalesce(description, ""),
    "priceLabel": coalesce(priceLabel, "Price on quote"),
    "imageUrl": image.asset->url + "?w=800&auto=format&fit=max"
  },
  "packages": *[_type == "rentalPackage"] | order(sortOrder asc)[0...20]{
    "id": _id, name, "guests": coalesce(guestsLabel, ""), "price": coalesce(priceLabel, ""), gear
  }
}`

export const eventsQuery = `{
  "page": *[_id == "eventsPage"][0],
  "services": *[_type == "eventService"] | order(sortOrder asc)[0...20]{
    "id": _id, title, description, ctaLabel, ctaLink, accent, ${image('image', 1200)}
  },
  "weddings": *[_type == "weddingPackage"] | order(sortOrder asc)[0...20]{
    "id": _id, name, guestsLabel, priceLabel, includes
  },
  "alaCarte": *[_type == "alaCarteItem"] | order(sortOrder asc)[0...60]{ "id": _id, name, priceLabel },
  "venues": *[_type == "venue"] | order(sortOrder asc)[0...60]{ "id": _id, name }
}`

export const aboutQuery = `{
  "page": *[_id == "aboutPage"][0]{
    ...,
    ${image('groupPhoto', 1400)},
    offTheRecord[]{ _key, question, answers[]{ _key, answer, "person": person->{ _id, name } } }
  },
  "team": *[_type == "teamMember"] | order(sortOrder asc)[0...20]{
    "id": _id, name, jobTitle, ${image('portrait', 800)}
  }
}`

export const photosQuery = `{
  "gallery": *[_type == "galleryItem"] | order(sortOrder asc)[0...300]{
    "id": _id, title, category, large, isVideo, videoUrl, ${GALLERY_MEDIA}
  },
  "settings": ${SETTINGS}
}`

export const contactQuery = `{
  "page": *[_id == "contactPage"][0]{ ..., ${image('sidePhoto', 1200)} },
  "settings": ${SETTINGS}
}`
