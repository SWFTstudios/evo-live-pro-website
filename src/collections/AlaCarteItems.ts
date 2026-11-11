import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField, priceLabelField } from '../fields/orderField'

export const AlaCarteItems: CollectionConfig = {
  slug: 'a-la-carte',
  labels: { singular: 'À la carte Item', plural: 'À la carte Pricing' },
  admin: {
    group: 'Events & Pricing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'priceLabel'],
    description: 'Add-on prices like Ceremony audio or Video wall.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true },
    priceLabelField('$0'),
    orderField,
  ],
}
