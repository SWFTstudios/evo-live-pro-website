import {PinIcon} from '@sanity/icons/Pin'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: venues
export const venue = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  icon: PinIcon,
  description: 'Venues listed on the Events page.',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {select: {title: 'name'}},
})
