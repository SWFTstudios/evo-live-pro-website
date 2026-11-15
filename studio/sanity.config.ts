import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes, singletonTypes, websiteOnlyTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'ax3lhw5y'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const singletons = new Set<string>(singletonTypes)
const hiddenFromNew = new Set<string>([...singletonTypes, ...websiteOnlyTypes])
// Singletons can be published and reverted, but not duplicated, deleted or unpublished.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Evo Live Pro CMS',

  projectId,
  dataset,

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Remove singletons and website-only types from "New document".
    templates: (templates) => templates.filter(({schemaType}) => !hiddenFromNew.has(schemaType)),
  },

  document: {
    actions: (input, {schemaType}) => {
      if (singletons.has(schemaType)) return input.filter(({action}) => action && singletonActions.has(action))
      if (schemaType === 'inquiry') return input.filter(({action}) => action !== 'duplicate')
      return input
    },
  },
})
