import {TagIcon} from '@sanity/icons/Tag'
import {defineField, defineType} from 'sanity'
import {priceLabelField, sortOrderField} from '../fields'

// Payload slug: a-la-carte
export const alaCarteItem = defineType({
  name: 'alaCarteItem',
  title: 'À la carte Item',
  type: 'document',
  icon: TagIcon,
  description: 'Add-on prices like Ceremony audio or Video wall.',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    priceLabelField('$0'),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'priceLabel'},
  },
})
