import {getCliClient} from 'sanity/cli'
import {schemaTypes} from '../schemaTypes'

export const API_VERSION = '2026-11-01'

/** Types the seed and migration own. `inquiry` is deliberately NOT here: never wipe customer data. */
export const CONTENT_TYPES = [
  'equipment',
  'equipmentCategory',
  'rentalPackage',
  'weddingPackage',
  'alaCarteItem',
  'eventService',
  'galleryItem',
  'teamMember',
  'brand',
  'venue',
  'testimonial',
  'faq',
] as const

export const SINGLETON_TYPES = [
  'siteSettings',
  'homePage',
  'aboutPage',
  'eventsPage',
  'contactPage',
] as const

/**
 * Returns the dataset a script may touch. Refuses `production` unless `allowFlag` is "true",
 * so a stray run never writes test content to the live site.
 */
export const resolveDataset = (fallback: string | null, allowFlag: string) => {
  const dataset = process.env.SANITY_STUDIO_DATASET || fallback
  if (!dataset) throw new Error('Set SANITY_STUDIO_DATASET (for example "development").')
  if (dataset === 'production' && process.env[allowFlag] !== 'true') {
    throw new Error(
      `Refusing to write to the "production" dataset. Run against "development", or set ${allowFlag}=true if you really mean it.`,
    )
  }
  return dataset
}

export const getClient = (dataset: string) =>
  getCliClient({apiVersion: API_VERSION}).withConfig({dataset, useCdn: false})

type FieldLike = {name?: string; initialValue?: unknown}

/**
 * The `initialValue`s declared in a schema type. The Studio applies these only when someone creates a
 * document in the UI, so scripts that create documents through the API apply them here. That is how
 * the old Payload `defaultValue`s are kept without typing them twice.
 */
export const schemaDefaults = (typeName: string): Record<string, unknown> => {
  const type = schemaTypes.find((t) => t.name === typeName) as
    | {fields?: FieldLike[]}
    | undefined
  if (!type?.fields) throw new Error(`Unknown schema type: ${typeName}`)
  const out: Record<string, unknown> = {}
  for (const field of type.fields) {
    if (field.name && field.initialValue !== undefined && typeof field.initialValue !== 'function') {
      out[field.name] = structuredClone(field.initialValue)
    }
  }
  return out
}

/** Field names declared on a schema type; scripts use them to drop anything the schema doesn't have. */
export const fieldNames = (typeName: string): string[] => {
  const type = schemaTypes.find((t) => t.name === typeName) as {fields?: FieldLike[]} | undefined
  if (!type?.fields) throw new Error(`Unknown schema type: ${typeName}`)
  return type.fields.flatMap((f) => (f.name ? [f.name] : []))
}

/** Removes null/undefined (Payload returns null for empty fields; Sanity wants them absent). */
export const strip = <T>(value: T): T => {
  if (Array.isArray(value)) return value.map(strip) as T
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => [k, strip(v)]),
    ) as T
  }
  return value
}

export const ref = (id: string) => ({_type: 'reference' as const, _ref: id})

/** Splits mutations into batches so one transaction never gets too large. */
export const chunk = <T>(items: T[], size: number): T[][] => {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size))
  return out
}
