import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {defineField, defineType} from 'sanity'
import {stringListField} from '../fields'

// Payload global: contact-page. The three option lists were arrays of `{ value }`; now plain strings.
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  icon: EnvelopeIcon,
  description:
    'Phone, email and address come from Site Settings. Changes go live when you press Publish.',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', initialValue: 'Contact us'}),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      initialValue: 'Ready to elevate your next event?',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 3,
      initialValue:
        'Whether you are a venue manager looking for a full production install or a fellow professional seeking a rental, we are ready to assist.',
    }),
    defineField({name: 'bookTitle', title: 'Book title', type: 'string', initialValue: 'Book Evo'}),
    defineField({
      name: 'bookNote',
      title: 'Book note',
      type: 'string',
      initialValue: 'DJ, production or a full event',
    }),
    defineField({name: 'rentTitle', title: 'Rent title', type: 'string', initialValue: 'Rent equipment'}),
    defineField({
      name: 'rentNote',
      title: 'Rent note',
      type: 'string',
      initialValue: 'Pickup or delivery, setup optional',
    }),
    stringListField('eventTypes', 'Types of event', [
      'Wedding',
      'Corporate',
      'Concert / live',
      'Private party',
      'Other',
    ]),
    stringListField('budgetRanges', 'Budget ranges', [
      'Under $2,500',
      '$2,500 – $5,500',
      '$5,500 – $8,500',
      '$8,500 – $12,500',
      '$12,500+',
      'Not sure yet',
    ]),
    stringListField('fulfillmentOptions', 'Pickup or delivery options', [
      'Delivery + setup',
      'Delivery only',
      'Warehouse pickup (Lyndhurst, NJ)',
    ]),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      initialValue: 'Thanks! We got your request and will reply within one business day.',
    }),
    defineField({name: 'sidePhoto', title: 'Crew photo', type: 'mediaImage'}),
  ],
  preview: {prepare: () => ({title: 'Contact Page'})},
})
