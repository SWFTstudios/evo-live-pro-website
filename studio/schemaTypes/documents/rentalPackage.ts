import {PresentationIcon} from '@sanity/icons/Presentation'
import {defineField, defineType} from 'sanity'
import {priceLabelField, sortOrderField} from '../fields'

// Payload slug: rental-packages
export const rentalPackage = defineType({
  name: 'rentalPackage',
  title: 'Sound + DJ Package',
  type: 'document',
  icon: PresentationIcon,
  description: 'The room-sized packages at the top of the Rentals page.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Example: Small Room',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'guestsLabel',
      title: 'Guest count',
      type: 'string',
      description: 'Example: Up to 100 guests',
    }),
    priceLabelField('$0+'),
    defineField({
      name: 'gear',
      title: 'What is included',
      type: 'text',
      rows: 4,
      validation: (r) => r.required(),
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
