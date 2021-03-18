// @ts-nocheck
import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: import.meta.env?.VITE_PROJECT_ID,
  dataset: import.meta.env?.VITE_DATASET,
  token: import.meta.env?.VITE_SANITY_API_KEY,
  useCdn: true,
})

export default client
