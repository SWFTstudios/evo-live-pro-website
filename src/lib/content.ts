import { cache } from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import { stegaClean } from '@sanity/client/stega'
import { sanityFetch } from '@/sanity/client'
import type { MediaRef } from '@/sanity/media'
import {
  aboutQuery,
  contactQuery,
  eventsQuery,
  homeQuery,
  photosQuery,
  rentalsQuery,
  settingsQuery,
} from '@/sanity/queries'

export type { MediaRef }

type Keyed = { _key: string }

export type SiteSettings = {
  businessName: string
  tagline?: string | null
  phone?: string | null
  email?: string | null
  location?: string | null
  instagramHandle?: string | null
  instagramUrl?: string | null
  logoWordmark?: MediaRef
  logoMark?: MediaRef
  shareImage?: MediaRef
  navigation?: (Keyed & { label: string; url: string })[] | null
  bookButtonLabel?: string | null
  rentButtonLabel?: string | null
  footerNote?: string | null
  copyright?: string | null
  gtmId?: string | null
  siteUrl?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

type Text = string | null | undefined

export type HomePage = {
  eyebrow?: Text
  headline?: Text
  subheadline?: Text
  heroVideo?: MediaRef
  heroImage?: MediaRef
  bookLabel?: Text
  bookButton?: Text
  rentLabel?: Text
  rentButton?: Text
  trustBadges?: string[] | null
  whatWeDoTitle?: Text
  whatWeDoIntro?: Text
  services?: (Keyed & { title: string; description: string; image?: MediaRef })[] | null
  howTitle?: Text
  howSteps?: (Keyed & { title: string; text: string })[] | null
  testimonialsTitle?: Text
  faqTitle?: Text
  closingHeadline?: Text
  closingText?: Text
  recentSetupsTitle?: Text
  weddingTeaserLabel?: Text
  weddingTeaserPrice?: Text
  weddingTeaserText?: Text
  weddingTeaserButton?: Text
  soundTeaserLabel?: Text
  soundTeaserPrice?: Text
  soundTeaserText?: Text
  soundTeaserButton?: Text
  brandsTitle?: Text
}

export type GalleryDoc = {
  id: string
  title: string
  category: string
  large?: boolean | null
  isVideo?: boolean | null
  videoUrl?: string | null
  media?: MediaRef
}

export type EventsPage = {
  eyebrow?: Text
  headline?: Text
  intro?: Text
  servicesTitle?: Text
  weddingEyebrow?: Text
  weddingTitle?: Text
  weddingNote?: Text
  weddingButton?: Text
  alaCarteEyebrow?: Text
  alaCarteTitle?: Text
  alaCarteNote?: Text
  capabilities?: (Keyed & { letter: string; title: string; description: string })[] | null
  venuesTitle?: Text
  venuesNote?: Text
  closingHeadline?: Text
  closingButton?: Text
}

export type AboutPage = {
  eyebrow?: Text
  headline?: Text
  originStory?: PortableTextBlock[] | null
  groupPhoto?: MediaRef
  groupPhotoCaption?: Text
  crewTitle?: Text
  offTheRecordTitle?: Text
  offTheRecord?:
    | (Keyed & { question: string; answers?: (Keyed & { answer: string; person?: { _id: string; name: string } | null })[] | null })[]
    | null
  threeWords?: string[] | null
}

export type ContactPage = {
  eyebrow?: Text
  headline?: Text
  intro?: Text
  bookTitle?: Text
  bookNote?: Text
  rentTitle?: Text
  rentNote?: Text
  eventTypes?: string[] | null
  budgetRanges?: string[] | null
  fulfillmentOptions?: string[] | null
  successMessage?: Text
  sidePhoto?: MediaRef
}

// Visual editing ("stega") hides invisible markers inside text so editors can click it to edit.
// Those markers must never reach links, phone numbers, form option values, the quote cart, analytics
// or <head> tags, so anything used that way is cleaned here, in one place. Display-only text keeps them.
const clean = <T>(value: T): T => stegaClean(value) as T

// A page that has never been published (an empty dataset) must still render, not crash.
const FALLBACK_SETTINGS: SiteSettings = { businessName: 'Evo Live Pro', navigation: [] }

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  return (await sanityFetch<SiteSettings | null>(settingsQuery, {}, { stega: false })) ?? FALLBACK_SETTINGS
})

export const getHomeData = async () => {
  const data = await sanityFetch<{
    home: HomePage | null
    settings: SiteSettings | null
    featured: GalleryDoc[]
    brands: { id: string; name: string; logo?: MediaRef }[]
    faqs: { id: string; question: string; answer: string }[]
    testimonials: { id: string; quote: string; name: string; eventType?: string | null }[]
  }>(homeQuery)
  return { ...data, home: data.home ?? {}, settings: clean(data.settings) ?? FALLBACK_SETTINGS }
}

export const getRentalsData = async () => {
  const data = await sanityFetch<{
    categories: { name: string }[]
    equipment: {
      id: string
      name: string
      category: string
      subcategory: string
      description: string
      priceLabel: string
      imageUrl: string | null
    }[]
    packages: { id: string; name: string; guests: string; price: string; gear: string }[]
  }>(rentalsQuery)
  return {
    // Category names are filter tabs and item names go into the quote cart and the inquiry: clean them.
    categories: clean(data.categories),
    equipment: data.equipment.map((item) => ({ ...item, name: clean(item.name), category: clean(item.category), imageUrl: clean(item.imageUrl) })),
    packages: data.packages.map((pack) => ({ ...pack, name: clean(pack.name) })),
  }
}

export const getEventsData = async () => {
  const data = await sanityFetch<{
    page: EventsPage | null
    services: {
      id: string
      title: string
      description: string
      ctaLabel?: string | null
      ctaLink?: string | null
      accent?: string | null
      image?: MediaRef
    }[]
    weddings: { id: string; name: string; guestsLabel?: string | null; priceLabel?: string | null; includes?: string[] | null }[]
    alaCarte: { id: string; name: string; priceLabel?: string | null }[]
    venues: { id: string; name: string }[]
  }>(eventsQuery)
  return { ...data, page: data.page ?? {} }
}

export const getAboutData = async () => {
  const data = await sanityFetch<{
    page: AboutPage | null
    team: { id: string; name: string; jobTitle?: string | null; portrait?: MediaRef }[]
  }>(aboutQuery)
  return { ...data, page: data.page ?? {} }
}

export const getPhotosData = async () => {
  const data = await sanityFetch<{ gallery: GalleryDoc[]; settings: SiteSettings | null }>(photosQuery)
  return {
    gallery: data.gallery.map((item) => ({ ...item, category: clean(item.category), title: clean(item.title), videoUrl: clean(item.videoUrl) })),
    settings: clean(data.settings) ?? FALLBACK_SETTINGS,
  }
}

export const getContactData = async () => {
  const data = await sanityFetch<{ page: ContactPage | null; settings: SiteSettings | null }>(contactQuery)
  const page = data.page ?? {}
  return {
    // The option lists become <option> values that are submitted with the form: clean them.
    page: {
      ...page,
      eventTypes: clean(page.eventTypes),
      budgetRanges: clean(page.budgetRanges),
      fulfillmentOptions: clean(page.fulfillmentOptions),
    },
    settings: clean(data.settings) ?? FALLBACK_SETTINGS,
  }
}
