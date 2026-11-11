import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const EventServices: CollectionConfig = {
  slug: 'event-services',
  labels: { singular: 'Event Service', plural: 'Event Services' },
  admin: {
    group: 'Pages & Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'ctaLabel', 'accent'],
    description: 'The cards on the Events page: Weddings, Corporate, Concerts, and so on.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'ctaLabel', type: 'text', label: 'Button text', defaultValue: 'Plan an event →' },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Button link',
      defaultValue: '/contact',
      admin: { description: 'A page on this site like /contact, or #packages to jump down the page.' },
    },
    {
      name: 'accent',
      type: 'select',
      defaultValue: 'book',
      options: [
        { label: 'Booking (green)', value: 'book' },
        { label: 'Rentals (orange)', value: 'rent' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    orderField,
  ],
}
