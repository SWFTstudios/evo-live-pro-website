import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  admin: {
    group: 'Pages & Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'published'],
    description: 'Common questions shown near the bottom of the home page. Answer the questions people ask you most.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true, admin: { description: 'Two or three short sentences.' } },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Uncheck to hide this question from the website.' },
    },
    orderField,
  ],
}
