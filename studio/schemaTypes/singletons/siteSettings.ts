import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'
import {inGroup, keyed} from '../fields'

// Payload global: site-settings
const nav = (label: string, url: string) => ({label, url})

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  description: 'Contact details, menu and footer shown on every page. Changes go live when you press Publish.',
  groups: [
    {name: 'business', title: 'Business', default: true},
    {name: 'menu', title: 'Menu & buttons'},
    {name: 'footer', title: 'Footer'},
    {name: 'tracking', title: 'Tracking'},
    {name: 'seo', title: 'Google & sharing'},
  ],
  fields: [
    ...inGroup('business', [
      defineField({
        name: 'businessName',
        title: 'Business name',
        type: 'string',
        initialValue: 'Evo Live Pro',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'tagline',
        title: 'Tagline',
        type: 'string',
        initialValue: 'Audio · Lighting · Video · DJ · Lyndhurst, NJ',
      }),
      defineField({name: 'phone', title: 'Phone', type: 'string', initialValue: '(201) 913-9558'}),
      defineField({
        name: 'email',
        title: 'Email',
        type: 'string',
        initialValue: 'evolivepro@gmail.com',
        validation: (r) => r.email(),
      }),
      defineField({
        name: 'location',
        title: 'Location',
        type: 'string',
        initialValue: 'Lyndhurst, NJ 07071',
      }),
      defineField({
        name: 'instagramHandle',
        title: 'Instagram handle',
        type: 'string',
        initialValue: '@evolivepro',
      }),
      defineField({
        name: 'instagramUrl',
        title: 'Instagram URL',
        type: 'string',
        initialValue: 'https://instagram.com/evolivepro',
      }),
      defineField({name: 'logoWordmark', title: 'Logo (wide)', type: 'mediaImage'}),
      defineField({name: 'logoMark', title: 'Logo (icon only)', type: 'mediaImage'}),
    ]),
    ...inGroup('menu', [
      defineField({
        name: 'navigation',
        title: 'Menu links',
        type: 'array',
        description: 'Drag to reorder. These appear in the header and footer.',
        of: [
          {
            type: 'object',
            name: 'navLink',
            title: 'Link',
            fields: [
              defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
              defineField({name: 'url', title: 'URL', type: 'string', validation: (r) => r.required()}),
            ],
            preview: {select: {title: 'label', subtitle: 'url'}},
          },
        ],
        initialValue: keyed('navLink', [
          nav('Home', '/'),
          nav('About us', '/about'),
          nav('Rentals', '/rentals'),
          nav('Events', '/events'),
          nav('Partners', '/#partners'),
          nav('Photos', '/photos'),
          nav('Contact us', '/contact'),
        ]),
      }),
      defineField({
        name: 'bookButtonLabel',
        title: 'Green button text (booking)',
        type: 'string',
        initialValue: 'Book Evo',
      }),
      defineField({
        name: 'rentButtonLabel',
        title: 'Orange button text (rentals)',
        type: 'string',
        initialValue: 'Rent gear',
      }),
    ]),
    ...inGroup('footer', [
      defineField({
        name: 'footerNote',
        title: 'Footer note',
        type: 'text',
        rows: 2,
        initialValue: 'Live production for nights people remember.',
      }),
      defineField({
        name: 'copyright',
        title: 'Copyright',
        type: 'string',
        initialValue: 'Evo Live Pro. All rights reserved.',
      }),
    ]),
    ...inGroup('tracking', [
      defineField({
        name: 'gtmId',
        title: 'Google Tag Manager container ID',
        type: 'string',
        description:
          'Google Tag Manager collects visits and button clicks. Leave empty to turn tracking off. Looks like GTM-ABC1234. Find it at tagmanager.google.com, top right of your container. Only administrators can change it.',
        readOnly: ({currentUser}) =>
          !currentUser?.roles.some((role) => role.name === 'administrator'),
        validation: (r) =>
          r.custom((value?: string) =>
            !value || /^GTM-[A-Z0-9]{4,12}$/.test(value.trim())
              ? true
              : 'This should look like GTM-ABC1234.',
          ),
      }),
      defineField({
        name: 'siteUrl',
        title: 'Website address',
        type: 'string',
        initialValue: 'https://evo-live-pro-website.elombe.workers.dev',
        description:
          'The main address of the website, used for Google (sitemap and search listing). Change it when the custom domain is connected.',
      }),
    ]),
    ...inGroup('seo', [
      defineField({
        name: 'seoTitle',
        title: 'Search title',
        type: 'string',
        initialValue: 'Evo Live Pro | DJ, Sound, Lighting & LED Video in NJ',
      }),
      defineField({
        name: 'seoDescription',
        title: 'Search description',
        type: 'text',
        rows: 3,
        initialValue:
          'DJ, sound, lighting and LED video for weddings, corporate events and concerts. Book our crew or rent pro audio-visual gear in Lyndhurst, NJ.',
      }),
      defineField({
        name: 'shareImage',
        title: 'Image shown when the link is shared',
        type: 'mediaImage',
      }),
    ]),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})
