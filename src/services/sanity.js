import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: '164340f4',
  dataset: 'production',
  useCdn: import.meta.env.PROD,
  apiVersion: '2026-08-20',
})