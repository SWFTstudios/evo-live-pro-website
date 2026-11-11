import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries (Form Submissions)' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'eventDate', 'status', 'createdAt'],
    description: 'Everything people send through the Contact form and the rental quote cart.',
  },
  defaultSort: '-createdAt',
  access: {
    create: anyone,
    read: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        // Spam trap: real people never see or fill this field. Bots do.
        if (operation === 'create' && data?.website) {
          throw new Error('Submission rejected.')
        }
        if (data) delete data.website
        return data
      },
    ],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        { label: 'Booking inquiry', value: 'booking' },
        { label: 'Rental quote', value: 'rental' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Booked', value: 'booked' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'eventType', type: 'text' },
    { name: 'eventDate', type: 'text', label: 'Date' },
    { name: 'returnDate', type: 'text' },
    { name: 'venue', type: 'text' },
    { name: 'guestCount', type: 'text' },
    { name: 'budget', type: 'text' },
    { name: 'fulfillment', type: 'text', label: 'Pickup or delivery' },
    { name: 'quoteItems', type: 'textarea', label: 'Items in the quote cart' },
    { name: 'notes', type: 'textarea' },
  ],
}
