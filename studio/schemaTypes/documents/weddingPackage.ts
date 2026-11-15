import {HeartIcon} from '@sanity/icons/Heart'
import {defineField, defineType} from 'sanity'
import {priceLabelField, sortOrderField, stringListField} from '../fields'

// Payload slug: wedding-packages. `includes` was an array of `{ item }` objects; it is now plain strings.
export const weddingPackage = defineType({
  name: 'weddingPackage',
  title: 'Wedding Package',
  type: 'document',
  icon: HeartIcon,
  description: 'The wedding tiers on the Events page.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Example: The Nightlife Reserve',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guestsLabel',
      title: 'Guest count',
      type: 'string',
      description: 'Example: Up to 350 guests',
    }),
    priceLabelField('$0'),
    stringListField('includes', 'What is included', undefined, {
      description: 'Each line is its own bullet on the website.',
    }),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', guests: 'guestsLabel', price: 'priceLabel'},
    prepare: ({title, guests, price}) => ({
      title,
      subtitle: [guests, price].filter(Boolean).join(' · '),
    }),
  },
})
