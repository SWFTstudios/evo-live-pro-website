import type { ArrayField, GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

const stringList = (name: string, label: string, defaults: string[]): ArrayField =>
  ({
    name,
    type: 'array',
    label,
    labels: { singular: 'Option', plural: 'Options' },
    defaultValue: defaults.map((value) => ({ value })),
    fields: [{ name: 'value', type: 'text', required: true }],
  }) as ArrayField

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page',
  admin: { group: 'Pages & Content', description: 'Phone, email and address come from Site Settings.' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    { name: 'eyebrow', type: 'text', defaultValue: 'Contact us' },
    { name: 'headline', type: 'text', required: true, defaultValue: 'Ready to elevate your next event?' },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Whether you are a venue manager looking for a full production install or a fellow professional seeking a rental, we are ready to assist.',
    },
    { name: 'bookTitle', type: 'text', defaultValue: 'Book Evo' },
    { name: 'bookNote', type: 'text', defaultValue: 'DJ, production or a full event' },
    { name: 'rentTitle', type: 'text', defaultValue: 'Rent equipment' },
    { name: 'rentNote', type: 'text', defaultValue: 'Pickup or delivery, setup optional' },
    stringList('eventTypes', 'Types of event', ['Wedding', 'Corporate', 'Concert / live', 'Private party', 'Other']),
    stringList('budgetRanges', 'Budget ranges', [
      'Under $2,500',
      '$2,500 – $5,500',
      '$5,500 – $8,500',
      '$8,500 – $12,500',
      '$12,500+',
      'Not sure yet',
    ]),
    stringList('fulfillmentOptions', 'Pickup or delivery options', [
      'Delivery + setup',
      'Delivery only',
      'Warehouse pickup (Lyndhurst, NJ)',
    ]),
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thanks! We got your request and will reply within one business day.',
    },
    { name: 'sidePhoto', type: 'upload', relationTo: 'media', label: 'Crew photo' },
  ],
}
