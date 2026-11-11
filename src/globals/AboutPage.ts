import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: { group: 'Pages & Content' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'About us · Our origins' },
    { name: 'headline', type: 'text', required: true, defaultValue: 'Two founders, one warehouse, a lot of gaff tape' },
    {
      name: 'originStory',
      type: 'richText',
      label: 'Origin story',
      admin: { description: 'How Evo started, the first gig, and how it grew. 2–3 short paragraphs.' },
    },
    { name: 'groupPhoto', type: 'upload', relationTo: 'media', label: 'Photo of the founders together' },
    { name: 'groupPhotoCaption', type: 'text', defaultValue: 'Brandon Patrisso shoot' },
    { name: 'crewTitle', type: 'text', defaultValue: 'Meet the crew' },
    { name: 'offTheRecordTitle', type: 'text', defaultValue: 'Off the record' },
    {
      name: 'offTheRecord',
      type: 'array',
      label: 'Questions and answers',
      labels: { singular: 'Question', plural: 'Questions' },
      fields: [
        { name: 'question', type: 'text', required: true },
        {
          name: 'answers',
          type: 'array',
          labels: { singular: 'Answer', plural: 'Answers' },
          fields: [
            { name: 'person', type: 'relationship', relationTo: 'team', required: true },
            { name: 'answer', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'threeWords',
      type: 'array',
      label: 'What Evo brings, in three words',
      maxRows: 3,
      labels: { singular: 'Word', plural: 'Words' },
      fields: [{ name: 'word', type: 'text', required: true }],
    },
  ],
}
