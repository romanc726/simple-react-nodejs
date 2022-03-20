
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
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.json({ message: 'Bad request' })
    return
  }

  const algoliaIndex = algolia.initIndex('my-index')

  const sanityAlgolia = indexer(
    {
      post: {
        index: algoliaIndex,
        projection: `{
          title,
          "path": slug.current,
          "body": pt::text(body)
        }`,
      },
      article: {
        index: algoliaIndex,
        projection: `{
          heading,
          "body": pt::text(body),
          "authorNames": authors[]->name
        }`,
      },
    },
    (document) => {
      switch (document._type) {
        case 'post':
          return {
            title: document.title,
            path: document.slug.current,
            body: flattenBlocks(document.body),
          }
        case 'article':
          return {
            title: document.heading,
            excerpt: flattenBlocks(document.excerpt),
            body: flattenBlocks(document.body),
          }
        default:
          throw new Error('You didnt handle a type you declared interest in')
      }
    },
  )

  await sanityAlgolia.webhookSync(sanity, req.body)

  return res.status(200).send('ok')
}
