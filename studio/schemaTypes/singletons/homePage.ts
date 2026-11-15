import {HomeIcon} from '@sanity/icons/Home'
import {defineField, defineType} from 'sanity'
import {inGroup, keyed, stringListField} from '../fields'

// Payload global: home-page. `trustBadges` was an array of `{ text }`; it is now plain strings.
export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  description: 'The words and media at the top of the website. Changes go live when you press Publish.',
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'whatWeDo', title: 'What we do'},
    {name: 'how', title: 'How it works'},
    {name: 'proof', title: 'Proof & questions'},
    {name: 'packages', title: 'Packages'},
  ],
  fields: [
    ...inGroup('hero', [
      defineField({
        name: 'eyebrow',
        title: 'Eyebrow',
        type: 'string',
        initialValue: 'Audio · Lighting · Video · DJ · Lyndhurst, NJ',
      }),
      defineField({
        name: 'headline',
        title: 'Headline',
        type: 'string',
        initialValue: 'Live production for nights people remember',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'subheadline',
        title: 'Subheadline',
        type: 'text',
        rows: 3,
        initialValue:
          'DJ, sound, lighting and LED video for weddings, corporate events and concerts. Book our crew, or rent the same gear we use.',
      }),
      defineField({
        name: 'heroVideo',
        title: 'Background video (10–15 seconds, muted loop)',
        type: 'videoFile',
      }),
      defineField({
        name: 'heroImage',
        title: 'Backup image (shown while video loads)',
        type: 'mediaImage',
      }),
      defineField({name: 'bookLabel', title: 'Book label', type: 'string', initialValue: "I'm planning an event"}),
      defineField({name: 'bookButton', title: 'Book button', type: 'string', initialValue: 'Book Evo →'}),
      defineField({name: 'rentLabel', title: 'Rent label', type: 'string', initialValue: 'I need equipment'}),
      defineField({name: 'rentButton', title: 'Rent button', type: 'string', initialValue: 'Browse rentals →'}),
      stringListField('trustBadges', 'Trust badges', [
        'RCF Precision Audio',
        'AlphaTheta / Pioneer DJ standard',
        'Safety certified',
        'Full production crew',
      ]),
    ]),
    ...inGroup('whatWeDo', [
      defineField({name: 'whatWeDoTitle', title: 'Title', type: 'string', initialValue: 'What we do'}),
      defineField({
        name: 'whatWeDoIntro',
        title: 'Intro',
        type: 'text',
        rows: 3,
        initialValue:
          'One crew from load-in to last track. We plan the setup, bring the gear and run it on the night.',
      }),
      defineField({
        name: 'services',
        title: 'Cards',
        type: 'array',
        of: [
          {
            type: 'object',
            name: 'serviceCard',
            title: 'Card',
            fields: [
              defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
              defineField({
                name: 'description',
                title: 'Description',
                type: 'text',
                rows: 3,
                validation: (r) => r.required(),
              }),
              defineField({name: 'image', title: 'Image', type: 'mediaImage'}),
            ],
            preview: {select: {title: 'title', subtitle: 'description', media: 'image'}},
          },
        ],
        initialValue: keyed('serviceCard', [
          {
            title: 'DJ',
            description: 'Lead DJ/MC and secondary DJ who read the room, from ceremony to after party.',
          },
          {
            title: 'Production',
            description: 'RCF sound, intelligent lighting, lasers, LED walls and staging, run by our crew.',
          },
          {
            title: 'Rentals',
            description: 'Pro audio, wireless mics, DJ backline, lighting, video walls, staging and power.',
          },
          {title: 'A/V Installs', description: 'Full production installs for venues, offices and lounges.'},
        ]),
      }),
    ]),
    ...inGroup('how', [
      defineField({name: 'howTitle', title: 'Title', type: 'string', initialValue: 'How it works'}),
      defineField({
        name: 'howSteps',
        title: 'Steps',
        type: 'array',
        validation: (r) => r.max(4),
        of: [
          {
            type: 'object',
            name: 'howStep',
            title: 'Step',
            fields: [
              defineField({name: 'title', title: 'Title', type: 'string', validation: (r) => r.required()}),
              defineField({
                name: 'text',
                title: 'Text',
                type: 'text',
                rows: 3,
                validation: (r) => r.required(),
              }),
            ],
            preview: {select: {title: 'title', subtitle: 'text'}},
          },
        ],
        initialValue: keyed('howStep', [
          {
            title: 'Tell us the date',
            text: 'Pick Book Evo or Rent gear and send the details. It takes about two minutes.',
          },
          {
            title: 'We design the setup',
            text: 'We confirm availability and come back with a plan and a price for your night.',
          },
          {
            title: 'We run the night',
            text: 'We load in, run the show and break it all down. You enjoy your event.',
          },
        ]),
      }),
    ]),
    ...inGroup('proof', [
      defineField({
        name: 'testimonialsTitle',
        title: 'Testimonials title',
        type: 'string',
        initialValue: 'What clients say',
      }),
      defineField({name: 'faqTitle', title: 'FAQ title', type: 'string', initialValue: 'Good to know'}),
      defineField({
        name: 'closingHeadline',
        title: 'Closing headline',
        type: 'string',
        initialValue: 'You bring the guests. We bring the night.',
      }),
      defineField({
        name: 'closingText',
        title: 'Closing text',
        type: 'text',
        rows: 2,
        initialValue: 'Tell us the date and the vibe. We will come back with a plan and a price.',
      }),
    ]),
    ...inGroup('packages', [
      defineField({
        name: 'recentSetupsTitle',
        title: 'Recent setups title',
        type: 'string',
        initialValue: 'Recent setups',
      }),
      defineField({
        name: 'weddingTeaserLabel',
        title: 'Wedding teaser label',
        type: 'string',
        initialValue: 'Wedding packages',
      }),
      defineField({
        name: 'weddingTeaserPrice',
        title: 'Wedding teaser price',
        type: 'string',
        initialValue: 'From $5,500',
      }),
      defineField({
        name: 'weddingTeaserText',
        title: 'Wedding teaser text',
        type: 'text',
        rows: 3,
        initialValue:
          'The Architectural Essentials, The Elevated Design Experience, The Nightlife Reserve and The Bespoke Production Reserve.',
      }),
      defineField({
        name: 'weddingTeaserButton',
        title: 'Wedding teaser button',
        type: 'string',
        initialValue: 'Compare packages →',
      }),
      defineField({
        name: 'soundTeaserLabel',
        title: 'Sound teaser label',
        type: 'string',
        initialValue: 'Sound + DJ packages',
      }),
      defineField({
        name: 'soundTeaserPrice',
        title: 'Sound teaser price',
        type: 'string',
        initialValue: 'From $1,000',
      }),
      defineField({
        name: 'soundTeaserText',
        title: 'Sound teaser text',
        type: 'text',
        rows: 3,
        initialValue:
          'Sized by room, from 100 guests to 800+. RCF speakers, CDJ-3000s, mixers, mics and a stagehand.',
      }),
      defineField({
        name: 'soundTeaserButton',
        title: 'Sound teaser button',
        type: 'string',
        initialValue: 'See rental packages →',
      }),
      defineField({
        name: 'brandsTitle',
        title: 'Brands title',
        type: 'string',
        initialValue: "Brands we've produced for",
      }),
    ]),
  ],
  preview: {prepare: () => ({title: 'Home Page'})},
})
