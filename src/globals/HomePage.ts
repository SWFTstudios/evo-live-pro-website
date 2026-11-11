import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home Page',
  admin: { group: 'Pages & Content', description: 'The words and media at the top of the website.' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'eyebrow', type: 'text', defaultValue: 'Audio · Lighting · Video · DJ · Lyndhurst, NJ' },
            { name: 'headline', type: 'text', required: true, defaultValue: 'Live production for nights people remember' },
            {
              name: 'subheadline',
              type: 'textarea',
              defaultValue:
                'DJ, sound, lighting and LED video for weddings, corporate events and concerts. Book our crew, or rent the same gear we use.',
            },
            { name: 'heroVideo', type: 'upload', relationTo: 'media', label: 'Background video (10–15 seconds, muted loop)' },
            { name: 'heroImage', type: 'upload', relationTo: 'media', label: 'Backup image (shown while video loads)' },
            { name: 'bookLabel', type: 'text', defaultValue: "I'm planning an event" },
            { name: 'bookButton', type: 'text', defaultValue: 'Book Evo →' },
            { name: 'rentLabel', type: 'text', defaultValue: 'I need equipment' },
            { name: 'rentButton', type: 'text', defaultValue: 'Browse rentals →' },
            {
              name: 'trustBadges',
              type: 'array',
              labels: { singular: 'Badge', plural: 'Badges' },
              defaultValue: [
                { text: 'RCF Precision Audio' },
                { text: 'AlphaTheta / Pioneer DJ standard' },
                { text: 'Safety certified' },
                { text: 'Full production crew' },
              ],
              fields: [{ name: 'text', type: 'text', required: true }],
            },
          ],
        },
        {
          label: 'What we do',
          fields: [
            { name: 'whatWeDoTitle', type: 'text', defaultValue: 'What we do' },
            {
              name: 'whatWeDoIntro',
              type: 'textarea',
              defaultValue:
                'One crew from load-in to last track. We plan the setup, bring the gear and run it on the night.',
            },
            {
              name: 'services',
              type: 'array',
              labels: { singular: 'Card', plural: 'Cards' },
              defaultValue: [
                { title: 'DJ', description: 'Lead DJ/MC and secondary DJ who read the room, from ceremony to after party.' },
                { title: 'Production', description: 'RCF sound, intelligent lighting, lasers, LED walls and staging, run by our crew.' },
                { title: 'Rentals', description: 'Pro audio, wireless mics, DJ backline, lighting, video walls, staging and power.' },
                { title: 'A/V Installs', description: 'Full production installs for venues, offices and lounges.' },
              ],
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Packages',
          fields: [
            { name: 'recentSetupsTitle', type: 'text', defaultValue: 'Recent setups' },
            { name: 'weddingTeaserLabel', type: 'text', defaultValue: 'Wedding packages' },
            { name: 'weddingTeaserPrice', type: 'text', defaultValue: 'From $5,500' },
            {
              name: 'weddingTeaserText',
              type: 'textarea',
              defaultValue:
                'The Architectural Essentials, The Elevated Design Experience, The Nightlife Reserve and The Bespoke Production Reserve.',
            },
            { name: 'weddingTeaserButton', type: 'text', defaultValue: 'Compare packages →' },
            { name: 'soundTeaserLabel', type: 'text', defaultValue: 'Sound + DJ packages' },
            { name: 'soundTeaserPrice', type: 'text', defaultValue: 'From $1,000' },
            {
              name: 'soundTeaserText',
              type: 'textarea',
              defaultValue:
                'Sized by room, from 100 guests to 800+. RCF speakers, CDJ-3000s, mixers, mics and a stagehand.',
            },
            { name: 'soundTeaserButton', type: 'text', defaultValue: 'See rental packages →' },
            { name: 'brandsTitle', type: 'text', defaultValue: "Brands we've produced for" },
          ],
        },
      ],
    },
  ],
}
