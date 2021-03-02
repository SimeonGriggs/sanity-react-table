import sanityClient from '@sanity/client'

const client = sanityClient({
  projectId: 't1i6zr4x',
  dataset: 'production',
  // @ts-ignore
  token: import.meta.env.VITE_SANITY_API_KEY,
  useCdn: true,
})

export default client
