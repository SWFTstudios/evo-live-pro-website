import {HelpCircleIcon} from '@sanity/icons/HelpCircle'
import {defineField, defineType} from 'sanity'
import {sortOrderField} from '../fields'

// Payload slug: faqs
export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: HelpCircleIcon,
  description:
    'Common questions shown near the bottom of the home page. Answer the questions people ask you most.',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 3,
      description: 'Two or three short sentences.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      description: 'Turn off to hide this question from the website.',
    }),
    sortOrderField(),
  ],
  orderings: [
    {title: 'Sort order', name: 'sortOrder', by: [{field: 'sortOrder', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'question', published: 'published'},
    prepare: ({title, published}) => ({title, subtitle: published === false ? '(Hidden)' : undefined}),
  },
})
