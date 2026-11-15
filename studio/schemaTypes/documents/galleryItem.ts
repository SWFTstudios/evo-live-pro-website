import {ImagesIcon} from '@sanity/icons/Images'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: gallery. Payload had one `media` upload that could be a photo or a video;
// here it is split into `image` and `video`.
export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Photo / Video',
  type: 'document',
  icon: ImagesIcon,
  description: 'Everything on the Photos page and the "Recent setups" row on the home page.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Example: The Graziano Wedding',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Weddings', value: 'weddings'},
          {title: 'Corporate', value: 'corporate'},
          {title: 'Concerts', value: 'concerts'},
          {title: 'Private Parties', value: 'private-parties'},
          {title: 'Behind the Scenes', value: 'behind-the-scenes'},
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'mediaImage',
      validation: (r) =>
        r
          .custom((value, context) =>
            value || context.document?.video || context.document?.videoUrl
              ? true
              : 'Add a photo, a video file or a video link. Without one, a placeholder shows.',
          )
          .warning(),
    }),
    defineField({name: 'video', title: 'Video file', type: 'videoFile'}),
    defineField({
      name: 'videoUrl',
      title: 'Video link (optional)',
      type: 'string',
      description: 'Paste an Instagram or YouTube link if the video is hosted there.',
    }),
    defineField({name: 'isVideo', title: 'This is a video', type: 'boolean', initialValue: false}),
    defineField({
      name: 'large',
      title: 'Show as a large tile',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'featuredOnHome',
      title: 'Show in "Recent setups" on the home page',
      type: 'boolean',
      initialValue: false,
    }),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category', featured: 'featuredOnHome', media: 'image'},
    prepare: ({title, category, featured, media}) => ({
      title,
      subtitle: [category, featured ? 'On home page' : null].filter(Boolean).join(' · '),
      media,
    }),
  },
})
