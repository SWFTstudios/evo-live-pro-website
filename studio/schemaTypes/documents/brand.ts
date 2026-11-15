import {StarIcon} from '@sanity/icons/Star'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: brands
export const brand = defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  icon: StarIcon,
  description: 'The brand names on the home page. Add a white logo if you have one.',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'mediaImage',
      description: 'Optional. The name shows as text without it.',
    }),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', media: 'logo'},
  },
})
