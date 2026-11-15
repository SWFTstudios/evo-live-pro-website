import {mediaImage} from './objects/mediaImage'
import {videoFile} from './objects/videoFile'

import {alaCarteItem} from './documents/alaCarteItem'
import {brand} from './documents/brand'
import {equipment} from './documents/equipment'
import {equipmentCategory} from './documents/equipmentCategory'
import {eventService} from './documents/eventService'
import {faq} from './documents/faq'
import {galleryItem} from './documents/galleryItem'
import {inquiry} from './documents/inquiry'
import {rentalPackage} from './documents/rentalPackage'
import {teamMember} from './documents/teamMember'
import {testimonial} from './documents/testimonial'
import {venue} from './documents/venue'
import {weddingPackage} from './documents/weddingPackage'

import {aboutPage} from './singletons/aboutPage'
import {contactPage} from './singletons/contactPage'
import {eventsPage} from './singletons/eventsPage'
import {homePage} from './singletons/homePage'
import {siteSettings} from './singletons/siteSettings'

/** One document each, with the document ID equal to the type name. */
export const singletonTypes = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'eventsPage',
  'contactPage',
] as const

/** Created by the website only, never from "New document". */
export const websiteOnlyTypes = ['inquiry'] as const

export const schemaTypes = [
  // objects
  mediaImage,
  videoFile,
  // singletons (Payload globals)
  siteSettings,
  homePage,
  aboutPage,
  eventsPage,
  contactPage,
  // documents (Payload collections)
  inquiry,
  equipmentCategory,
  equipment,
  rentalPackage,
  weddingPackage,
  alaCarteItem,
  eventService,
  teamMember,
  brand,
  venue,
  testimonial,
  faq,
  galleryItem,
]
