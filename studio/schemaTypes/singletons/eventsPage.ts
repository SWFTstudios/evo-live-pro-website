import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineField, defineType} from 'sanity'

// Payload global: events-page
const text = (name: string, title: string, initialValue: string, long = false) =>
  defineField({
    name,
    title,
    type: long ? 'text' : 'string',
    ...(long ? {rows: 3} : {}),
    initialValue,
  })

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  icon: CalendarIcon,
  description:
    'Packages and prices are edited under Events & Pricing. Changes go live when you press Publish.',
  fields: [
    text('eyebrow', 'Eyebrow', 'Events · Our capabilities'),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'You bring the guests. We bring the night.',
      validation: (r) => r.required(),
    }),
    text(
      'intro',
      'Intro',
      'Weddings, corporate events, concerts and private parties. We design the setup, load it in and run it live.',
      true,
    ),
    text('servicesTitle', 'Services title', 'Event services'),
    text('weddingEyebrow', 'Wedding eyebrow', '2026 wedding packages'),
    text('weddingTitle', 'Wedding title', 'Pick your night'),
    text(
      'weddingNote',
      'Wedding note',
      'All include a 4-hour reception, online playlist tool and planning consultations. Plus applicable tax.',
    ),
    text('weddingButton', 'Wedding button', 'Check my date'),
    text('alaCarteEyebrow', 'À la carte eyebrow', 'À la carte'),
    text('alaCarteTitle', 'À la carte title', 'Production & gear'),
    text(
      'alaCarteNote',
      'À la carte note',
      'Everything we run on our own shows. Need it without the crew? It is all on the rentals page.',
    ),
    defineField({
      name: 'capabilities',
      title: 'Capability list (A / D / L / S / V)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'capability',
          title: 'Capability',
          fields: [
            defineField({
              name: 'letter',
              title: 'Letter',
              type: 'string',
              validation: (r) => r.required().max(1),
            }),
            defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'letter'}},
        },
      ],
    }),
    text('venuesTitle', 'Venues title', 'Venues we know'),
    text(
      'venuesNote',
      'Venues note',
      'We have loaded in here before, so we know the power, the rules and the elevators.',
    ),
    text('closingHeadline', 'Closing headline', "Got a date? Let's build it."),
    text('closingButton', 'Closing button', 'Check availability'),
  ],
  preview: {prepare: () => ({title: 'Events Page'})},
})
