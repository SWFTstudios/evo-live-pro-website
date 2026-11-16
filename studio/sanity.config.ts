import {visionTool} from '@sanity/vision'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {StudioIcon} from './components/Brand'
import {SITE_URL} from './lib/site'
import {resolve} from './presentation/resolve'
import {schemaTypes, singletonTypes, websiteOnlyTypes} from './schemaTypes'
import {structure} from './structure'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'ax3lhw5y'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

const singletons = new Set<string>(singletonTypes)
const hiddenFromNew = new Set<string>([...singletonTypes, ...websiteOnlyTypes])
// Singletons can be published and reverted, but not duplicated, deleted or unpublished.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

// Evo's palette (from the old Payload dashboard theme): Webflow blue for actions.
const theme = buildLegacyTheme({
  '--brand-primary': '#146ef5',
  '--default-button-primary-color': '#146ef5',
  '--focus-color': '#146ef5',
})

export default defineConfig({
  name: 'default',
  title: 'Evo Live Pro CMS',
  icon: StudioIcon,
  theme,

  projectId,
  dataset,

  plugins: [
    structureTool({structure, title: 'Content'}),
    // The visual editor: shows the website and lets editors click any text or image to change it.
    presentationTool({
      title: 'Visual editor',
      resolve,
      previewUrl: {
        initial: SITE_URL,
        previewMode: {enable: '/api/draft-mode/enable'},
      },
      // The live site, plus any local copy a developer runs.
      allowOrigins: [SITE_URL, 'http://localhost:*'],
    }),
    visionTool(),
  ],

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
