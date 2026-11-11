import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Library',
    description: 'Photos, product images, logos and videos. Upload once, reuse anywhere.',
  },
  access: {
    read: anyone,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: isLoggedIn,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Short description of the picture, for screen readers and Google.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    // Image cropping and resizing need `sharp`, which Cloudflare Workers can't run.
    crop: false,
    focalPoint: false,
  },
}
