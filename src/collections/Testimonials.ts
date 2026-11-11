import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: {
    group: 'Pages & Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'eventType', 'published'],
    description:
      'Real words from real clients (with their permission). The section stays hidden on the website until at least one is published.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'quote', type: 'textarea', required: true, admin: { description: 'Their words, lightly trimmed. Keep it short.' } },
    { name: 'name', type: 'text', required: true, admin: { description: 'Example: Jess & Mike, or Sarah K.' } },
    { name: 'eventType', type: 'text', label: 'Event', admin: { description: 'Example: Wedding at The Venue, June 2026' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
