import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const GalleryItems: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Photo / Video', plural: 'Photos & Videos' },
  admin: {
    group: 'Library',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isVideo', 'featuredOnHome'],
    description: 'Everything on the Photos page and the "Recent setups" row on the home page.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { description: 'Example: The Graziano Wedding' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Weddings', value: 'weddings' },
        { label: 'Corporate', value: 'corporate' },
        { label: 'Concerts', value: 'concerts' },
        { label: 'Private Parties', value: 'private-parties' },
        { label: 'Behind the Scenes', value: 'behind-the-scenes' },
      ],
    },
    { name: 'media', type: 'upload', relationTo: 'media', label: 'Photo or video file' },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video link (optional)',
      admin: { description: 'Paste an Instagram or YouTube link if the video is hosted there.' },
    },
    { name: 'isVideo', type: 'checkbox', label: 'This is a video', defaultValue: false },
    {
      name: 'large',
      type: 'checkbox',
      label: 'Show as a large tile',
      defaultValue: false,
    },
    {
      name: 'featuredOnHome',
      type: 'checkbox',
      label: 'Show in "Recent setups" on the home page',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    orderField,
  ],
}
