import {defineDocuments, defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

// Tells the visual editor (Presentation tool) which website pages show each kind of document, so editors
// can jump from a document to where it appears, and from a page to the documents on it.

const page = (title: string, href: string) => ({title, href})
const HOME = page('Home', '/')
const ABOUT = page('About us', '/about')
const RENTALS = page('Rentals', '/rentals')
const EVENTS = page('Events', '/events')
const PHOTOS = page('Photos', '/photos')
const CONTACT = page('Contact us', '/contact')

const on = (...locations: {title: string; href: string}[]) => defineLocations({locations})

export const resolve: PresentationPluginOptions['resolve'] = {
  // Opening a page in the visual editor selects its main document.
  mainDocuments: defineDocuments([
    {route: '/', filter: `_id == "homePage"`},
    {route: '/about', filter: `_id == "aboutPage"`},
    {route: '/events', filter: `_id == "eventsPage"`},
    {route: '/contact', filter: `_id == "contactPage"`},
  ]),
  locations: {
    siteSettings: defineLocations({
      message: 'Used on every page (menu, footer, phone, email)',
      tone: 'positive',
      locations: [HOME, ABOUT, RENTALS, EVENTS, PHOTOS, CONTACT],
    }),
    homePage: on(HOME),
    aboutPage: on(ABOUT),
    eventsPage: on(EVENTS),
    contactPage: on(CONTACT),
    teamMember: on(ABOUT),
    eventService: on(EVENTS),
    weddingPackage: on(EVENTS),
    alaCarteItem: on(EVENTS),
    venue: on(EVENTS),
    equipment: on(RENTALS),
    equipmentCategory: on(RENTALS),
    rentalPackage: on(RENTALS),
    brand: on(HOME),
    faq: on(HOME),
    testimonial: on(HOME),
    galleryItem: defineLocations({
      select: {featured: 'featuredOnHome'},
      resolve: (doc) => ({locations: doc?.featured ? [PHOTOS, HOME] : [PHOTOS]}),
    }),
  },
}
