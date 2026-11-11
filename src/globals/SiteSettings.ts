import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Pages & Content', description: 'Contact details, menu and footer shown on every page.' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Business',
          fields: [
            { name: 'businessName', type: 'text', defaultValue: 'Evo Live Pro', required: true },
            { name: 'tagline', type: 'text', defaultValue: 'Audio · Lighting · Video · DJ · Lyndhurst, NJ' },
            { name: 'phone', type: 'text', defaultValue: '(201) 913-9558' },
            { name: 'email', type: 'email', defaultValue: 'evolivepro@gmail.com' },
            { name: 'location', type: 'text', defaultValue: 'Lyndhurst, NJ 07071' },
            { name: 'instagramHandle', type: 'text', defaultValue: '@evolivepro' },
            { name: 'instagramUrl', type: 'text', defaultValue: 'https://instagram.com/evolivepro' },
            { name: 'logoWordmark', type: 'upload', relationTo: 'media', label: 'Logo (wide)' },
            { name: 'logoMark', type: 'upload', relationTo: 'media', label: 'Logo (icon only)' },
          ],
        },
        {
          label: 'Menu & buttons',
          fields: [
            {
              name: 'navigation',
              type: 'array',
              label: 'Menu links',
              labels: { singular: 'Link', plural: 'Links' },
              admin: { description: 'Drag to reorder. These appear in the header and footer.' },
              defaultValue: [
                { label: 'Home', url: '/' },
                { label: 'About us', url: '/about' },
                { label: 'Rentals', url: '/rentals' },
                { label: 'Events', url: '/events' },
                { label: 'Partners', url: '/#partners' },
                { label: 'Photos', url: '/photos' },
                { label: 'Contact us', url: '/contact' },
              ],
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            { name: 'bookButtonLabel', type: 'text', defaultValue: 'Book Evo', label: 'Green button text (booking)' },
            { name: 'rentButtonLabel', type: 'text', defaultValue: 'Rent gear', label: 'Orange button text (rentals)' },
          ],
        },
        {
          label: 'Footer',
          fields: [
            { name: 'footerNote', type: 'textarea', defaultValue: 'Live production for nights people remember.' },
            { name: 'copyright', type: 'text', defaultValue: 'Evo Live Pro. All rights reserved.' },
          ],
        },
        {
          label: 'Google & sharing',
          fields: [
            { name: 'seoTitle', type: 'text', defaultValue: 'Evo Live Pro | DJ, Sound, Lighting & LED Video in NJ' },
            {
              name: 'seoDescription',
              type: 'textarea',
              defaultValue:
                'DJ, sound, lighting and LED video for weddings, corporate events and concerts. Book our crew or rent pro audio-visual gear in Lyndhurst, NJ.',
            },
            { name: 'shareImage', type: 'upload', relationTo: 'media', label: 'Image shown when the link is shared' },
          ],
        },
      ],
    },
  ],
}
