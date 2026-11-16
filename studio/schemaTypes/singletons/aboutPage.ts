import {InfoOutlineIcon} from '@sanity/icons/InfoOutline'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {stringListField} from '../fields'

// Payload global: about-page. `originStory` was Lexical rich text; it is now Portable Text.
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  icon: InfoOutlineIcon,
  description: 'Changes go live when you press Publish.',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'About us · Our origins'}),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Two founders, one warehouse, a lot of gaff tape',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'originStory',
      title: 'Origin story',
      type: 'array',
      description: 'How Evo started, the first gig, and how it grew. 2–3 short paragraphs.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Paragraph', value: 'normal'},
            {title: 'Heading', value: 'h3'},
          ],
          lists: [],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  defineField({
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (r) =>
                      r.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({name: 'groupPhoto', title: 'Photo of the founders together', type: 'mediaImage'}),
    defineField({
      name: 'groupPhotoCaption',
      title: 'Group photo caption',
      type: 'string',
      initialValue: 'Brandon Patrisso shoot',
    }),
    defineField({name: 'crewTitle', title: 'Crew title', type: 'string', initialValue: 'Meet the crew'}),
    defineField({
      name: 'offTheRecordTitle',
      title: 'Off the record title',
      type: 'string',
      initialValue: 'Off the record',
    }),
    defineField({
      name: 'offTheRecord',
      title: 'Questions and answers',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'qa',
          title: 'Question',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'answers',
              title: 'Answers',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'qaAnswer',
                  title: 'Answer',
                  fields: [
                    defineField({
                      name: 'person',
                      title: 'Person',
                      type: 'reference',
                      to: [{type: 'teamMember'}],
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'answer',
                      title: 'Answer',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                  ],
                  preview: {select: {title: 'person.name', subtitle: 'answer'}},
                },
              ],
            }),
          ],
          preview: {select: {title: 'question'}},
        },
      ],
    }),
    stringListField('threeWords', 'What Evo brings, in three words', undefined, {max: 3}),
  ],
  preview: {prepare: () => ({title: 'About Page'})},
})
