import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: '164340f4',
  dataset: 'production',
  // CDN en production (rapide, caché) ; API directe en dev pour voir
  // ses modifications Sanity immédiatement
  useCdn: import.meta.env.PROD,
  apiVersion: '2026-08-20',
})