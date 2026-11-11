import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  label: 'Events Page',
  admin: { group: 'Pages & Content', description: 'Packages and prices are edited under Events & Pricing.' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Events · Our capabilities' },
    { name: 'headline', type: 'text', required: true, defaultValue: 'You bring the guests. We bring the night.' },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Weddings, corporate events, concerts and private parties. We design the setup, load it in and run it live.',
    },
    { name: 'servicesTitle', type: 'text', defaultValue: 'Event services' },
    { name: 'weddingEyebrow', type: 'text', defaultValue: '2026 wedding packages' },
    { name: 'weddingTitle', type: 'text', defaultValue: 'Pick your night' },
    {
      name: 'weddingNote',
      type: 'text',
      defaultValue: 'All include a 4-hour reception, online playlist tool and planning consultations. Plus applicable tax.',
    },
    { name: 'weddingButton', type: 'text', defaultValue: 'Check my date' },
    { name: 'alaCarteEyebrow', type: 'text', defaultValue: 'À la carte' },
    { name: 'alaCarteTitle', type: 'text', defaultValue: 'Production & gear' },
    {
      name: 'alaCarteNote',
      type: 'text',
      defaultValue: 'Everything we run on our own shows. Need it without the crew? It is all on the rentals page.',
    },
    {
      name: 'capabilities',
      type: 'array',
      label: 'Capability list (A / D / L / S / V)',
      labels: { singular: 'Capability', plural: 'Capabilities' },
      fields: [
        { name: 'letter', type: 'text', required: true, maxLength: 1 },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },
    { name: 'venuesTitle', type: 'text', defaultValue: 'Venues we know' },
    {
      name: 'venuesNote',
      type: 'text',
      defaultValue: 'We have loaded in here before, so we know the power, the rules and the elevators.',
    },
    { name: 'closingHeadline', type: 'text', defaultValue: "Got a date? Let's build it." },
    { name: 'closingButton', type: 'text', defaultValue: 'Check availability' },
  ],
}
