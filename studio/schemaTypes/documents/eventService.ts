import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: event-services
export const eventService = defineType({
  name: 'eventService',
  title: 'Event Service',
  type: 'document',
  icon: CalendarIcon,
  description: 'The cards on the Events page: Weddings, Corporate, Concerts, and so on.',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button text',
      type: 'string',
      initialValue: 'Plan an event →',
    }),
    defineField({
      name: 'ctaLink',
      title: 'Button link',
      type: 'string',
      initialValue: '/contact',
      description: 'A page on this site like /contact, or #packages to jump down the page.',
    }),
    defineField({
      name: 'accent',
      title: 'Accent',
      type: 'string',
      initialValue: 'book',
      options: {
        layout: 'radio',
        list: [
          {title: 'Booking (green)', value: 'book'},
          {title: 'Rentals (orange)', value: 'rent'},
        ],
      },
    }),
    defineField({name: 'image', title: 'Image', type: 'mediaImage'}),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', subtitle: 'ctaLabel', media: 'image'},
  },
})
