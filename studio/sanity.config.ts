import {visionTool} from '@sanity/vision'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {StudioIcon} from './components/Brand'
import {SITE_URL, TEST_SITE_URL} from './lib/site'
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

// One Studio, two workspaces (switch at the top left):
// - "Evo Live Pro" edits the real content (production dataset) and previews the live website.
// - "Test content" edits the seeded development dataset and previews the test version of the site,
//   so changes can be tried without touching the live site.
const workspace = ({
  name,
  title,
  basePath,
  dataset,
  previewOrigin,
}: {
  name: string
  title: string
  basePath: string
  dataset: string
  previewOrigin: string
}) =>
  defineConfig({
    name,
    title,
    basePath,
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
          initial: previewOrigin,
          previewMode: {enable: '/api/draft-mode/enable'},
        },
        // The site this workspace previews, plus any local copy a developer runs.
        allowOrigins: [previewOrigin, 'http://localhost:*'],
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
        if (singletons.has(schemaType))
          return input.filter(({action}) => action && singletonActions.has(action))
        if (schemaType === 'inquiry') return input.filter(({action}) => action !== 'duplicate')
        return input
      },
    },
  })

export default [
  workspace({
    name: 'production',
    title: 'Evo Live Pro',
    basePath: '/production',
    dataset,
    previewOrigin: SITE_URL,
  }),
  workspace({
    name: 'development',
    title: 'Test content',
    basePath: '/test',
    dataset: 'development',
    previewOrigin: TEST_SITE_URL,
  }),
]
