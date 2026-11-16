import {defineField, type FieldDefinition} from 'sanity'

/** Lower numbers show first on the website. */
export const sortOrderField = () =>
  defineField({
    name: 'sortOrder',
    title: 'Sort order',
    type: 'number',
    initialValue: 100,
    description: 'Lower numbers show first on the website. Example: 10 shows before 20.',
  })

/** Prices are free text on purpose, e.g. "From $1,200", "(2) $600" or "Price on quote". */
export const priceLabelField = (initialValue = 'Price on quote') =>
  defineField({
    name: 'priceLabel',
    title: 'Price shown on the website',
    type: 'string',
    initialValue,
    description:
      'Type it exactly how customers should see it, e.g. "From $1,200" or "Price on quote".',
  })

/** A list of plain strings (replaces Payload's array of `{ value }` objects). */
export const stringListField = (
  name: string,
  title: string,
  initialValue?: string[],
  options: {max?: number; description?: string; group?: string} = {},
) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [{type: 'string'}],
    initialValue,
    description: options.description,
    group: options.group,
    validation: options.max ? (rule) => rule.max(options.max as number) : undefined,
  })

/** Sets the same field group on every field. */
export const inGroup = (group: string, fields: FieldDefinition[]): FieldDefinition[] =>
  fields.map((field) => ({...field, group}) as FieldDefinition)

/** Gives initial-value array items the `_key` and `_type` Sanity needs. */
export const keyed = <T extends object>(type: string, items: T[]) =>
  items.map((item, i) => ({_key: `${type}-${i}`, _type: type, ...item}))
