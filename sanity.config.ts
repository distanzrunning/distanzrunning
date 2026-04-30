'use client'

/**
 * Sanity Studio configuration.
 *
 * Mounted at `/admin/studio` via `src/app/admin/studio/[[...tool]]/page.tsx`,
 * sitting inside the admin URL space (auth-gated by the admin cookie). Sanity's
 * own login still runs inside the Studio component for API access.
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {studioTheme} from './src/sanity/theme'
import StudioLogo from './src/sanity/components/StudioLogo'

export default defineConfig({
  basePath: '/admin/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  // Distanz brand theme — see src/sanity/theme.ts for token mappings.
  theme: studioTheme,
  // Replace Sanity's default S mark with the Distanz wordmark in
  // the Studio's top-left logo slot. Navbar / search / workspace
  // switcher stay as Sanity defaults — those carry functional UX.
  studio: {
    components: {
      logo: StudioLogo,
    },
  },
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
