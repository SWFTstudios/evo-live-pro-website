import {CommentIcon} from '@sanity/icons/Comment'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: testimonials
export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: CommentIcon,
  description:
    'Real words from real clients (with their permission). The section stays hidden on the website until at least one is published.',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      description: 'Their words, lightly trimmed. Keep it short.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Example: Jess & Mike, or Sarah K.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'eventType',
      title: 'Event',
      type: 'string',
      description: 'Example: Wedding at The Venue, June 2026',
    }),
    defineField({name: 'photo', title: 'Photo', type: 'mediaImage'}),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this testimonial from the website.',
    }),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', quote: 'quote', event: 'eventType', published: 'published', media: 'photo'},
    prepare: ({title, quote, event, published, media}) => ({
      title,
      subtitle: [published === false ? '(Hidden)' : null, event ?? quote].filter(Boolean).join(' · '),
      media,
    }),
  },
})
