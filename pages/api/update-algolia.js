
import sanityClient from '@sanity/client'
import algoliasearch from 'algoliasearch'
import indexer, { flattenBlocks } from 'sanity-algolia'
 
const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
)

const sanity = sanityClient({
  dataset: process.env.SANITY_PROJECT_DATASET,
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-03-25',
  useCdn: false,
})

export default async function handler(req, res) {
  const sanityAlgolia = indexer(
    {
      post: {
        index: algolia.initIndex('posts'),
      },
    },
    document => {
      switch (document._type) {
        case 'post':
          return {
            title: document.title,
            path: document.slug.current,
            publishedAt: document.publishedAt,
            excerpt: flattenBlocks(document.excerpt),
          }
        default:
          throw new Error(`Unknown type: ${document.type}`)
      }
    }
  )
 
  await sanityAlgolia.webhookSync(sanity, req.body)

  return res.status(200).send('ok')
}
