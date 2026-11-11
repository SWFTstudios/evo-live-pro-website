import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const TeamMembers: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Team Member', plural: 'Team' },
  admin: {
    group: 'Pages & Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'jobTitle'],
    description: 'The people shown on the About page.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'jobTitle', type: 'text', label: 'Job title', admin: { description: 'Example: Co-Founder & Creative Director' } },
    { name: 'portrait', type: 'upload', relationTo: 'media' },
    orderField,
  ],
}
