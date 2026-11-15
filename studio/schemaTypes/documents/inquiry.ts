import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'

// Payload slug: inquiries.
// Created ONLY by the website's server route (never by hand). Document IDs are `inquiry.<uuid>`:
// IDs containing a dot are not publicly readable, which keeps customer details private.
const readOnly = true

export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  icon: EnvelopeIcon,
  description:
    'Everything people send through the Contact form and the rental quote cart. Only Status and Notes can be changed.',
  fields: [
    defineField({
      name: 'kind',
      title: 'Kind',
      type: 'string',
      readOnly,
      options: {
        list: [
          {title: 'Booking inquiry', value: 'booking'},
          {title: 'Rental quote', value: 'rental'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      initialValue: 'new',
      options: {
        layout: 'radio',
        list: [
          {title: 'New', value: 'new'},
          {title: 'In progress', value: 'in-progress'},
          {title: 'Quoted', value: 'quoted'},
          {title: 'Booked', value: 'booked'},
          {title: 'Closed', value: 'closed'},
        ],
      },
    }),
    defineField({name: 'name', title: 'Name', type: 'string', readOnly, validation: (r) => r.required()}),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      readOnly,
      validation: (r) => r.required().email(),
    }),
    defineField({name: 'phone', title: 'Phone', type: 'string', readOnly}),
    defineField({name: 'eventType', title: 'Event type', type: 'string', readOnly}),
    defineField({name: 'eventDate', title: 'Date', type: 'string', readOnly}),
    defineField({name: 'returnDate', title: 'Return date', type: 'string', readOnly}),
    defineField({name: 'venue', title: 'Venue', type: 'string', readOnly}),
    defineField({name: 'guestCount', title: 'Guest count', type: 'string', readOnly}),
    defineField({name: 'budget', title: 'Budget', type: 'string', readOnly}),
    defineField({name: 'fulfillment', title: 'Pickup or delivery', type: 'string', readOnly}),
    defineField({
      name: 'quoteItems',
      title: 'Items in the quote cart',
      type: 'text',
      rows: 4,
      readOnly,
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      rows: 4,
      description: 'What the customer wrote. You can add your own notes below it.',
    }),
    defineField({name: 'submittedAt', title: 'Submitted', type: 'datetime', readOnly}),
  ],
  orderings: [
    {title: 'Newest first', name: 'submittedDesc', by: [{field: 'submittedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'name', kind: 'kind', date: 'eventDate', status: 'status'},
    prepare: ({title, kind, date, status}) => ({
      title,
      subtitle: [kind, date, status].filter(Boolean).join(' · '),
    }),
  },
})
