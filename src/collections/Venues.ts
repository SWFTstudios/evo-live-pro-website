import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const Venues: CollectionConfig = {
  slug: 'venues',
  labels: { singular: 'Venue', plural: 'Venues We Know' },
  admin: {
    group: 'Pages & Content',
    useAsTitle: 'name',
    description: 'Venues listed on the Events page.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [{ name: 'name', type: 'text', required: true }, orderField],
}
