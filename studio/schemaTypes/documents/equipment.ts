import {PackageIcon} from '@sanity/icons/Package'
import {defineField, defineType} from 'sanity'
import {priceLabelField, sortOrderField} from '../fields'

// Payload slug: equipment
export const equipment = defineType({
  name: 'equipment',
  title: 'Equipment Item',
  type: 'document',
  icon: PackageIcon,
  description:
    'Every item people can add to a rental quote. Hide an item by turning off "Available".',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Example: RCF ART 915A',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'equipmentCategory'}],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      description: 'Small label above the name, like "Point source" or "Moving heads".',
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'string',
      description: 'One line, like: 15" powered top',
    }),
    priceLabelField(),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'mediaImage',
      description: 'Best as a transparent PNG on a plain background.',
    }),
    sortOrderField(),
    defineField({
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this item from the website.',
    }),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
    {title: 'Name', name: 'name', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'name',
      category: 'category.name',
      price: 'priceLabel',
      available: 'available',
      media: 'image',
    },
    prepare: ({title, category, price, available, media}) => ({
      title,
      subtitle: [category, price, available === false ? '(Hidden)' : null]
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
