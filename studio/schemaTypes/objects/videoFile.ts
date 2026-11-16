import {defineField, defineType} from 'sanity'

export const videoFile = defineType({
  name: 'videoFile',
  title: 'Video',
  type: 'file',
  options: {accept: 'video/mp4,video/webm'},
  fields: [
    defineField({
      name: 'alt',
      title: 'Description',
      type: 'string',
      description: 'Short description of the video, for screen readers. MP4 works best. Keep it short.',
    }),
  ],
})
