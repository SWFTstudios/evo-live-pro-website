import {UserIcon} from '@sanity/icons/User'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: team
export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  icon: UserIcon,
  description: 'The people shown on the About page.',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'jobTitle',
      title: 'Job title',
      type: 'string',
      description: 'Example: Co-Founder & Creative Director',
    }),
    defineField({name: 'portrait', title: 'Portrait', type: 'mediaImage'}),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', subtitle: 'jobTitle', media: 'portrait'},
  },
})
