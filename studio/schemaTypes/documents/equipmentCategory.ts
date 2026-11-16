import {TagsIcon} from '@sanity/icons/Tags'
import {defineField, defineType} from 'sanity'
import {slugify} from '../../lib/slugify'
import {sortOrderField} from '../fields'

// Payload slug: equipment-categories
export const equipmentCategory = defineType({
  name: 'equipmentCategory',
  title: 'Equipment Category',
  type: 'document',
  icon: TagsIcon,
  description: 'The groups shown on the Rentals page, like Lighting or DJ Equipment.',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', slugify},
      description: 'Filled in automatically. Leave blank.',
    }),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', order: 'sortOrder'},
    prepare: ({title, order}) => ({title, subtitle: order != null ? `#${order}` : undefined}),
  },
})
