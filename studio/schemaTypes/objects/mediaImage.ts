import {defineField, defineType} from 'sanity'

/**
 * Replaces Payload's `media` collection for pictures. The file lives in Sanity's
 * asset library (and image CDN); the alt text lives on each use.
 */
export const mediaImage = defineType({
  name: 'mediaImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Short description of the picture, for screen readers and Google.',
      validation: (rule) => rule.required(),
    }),
  ],
})
