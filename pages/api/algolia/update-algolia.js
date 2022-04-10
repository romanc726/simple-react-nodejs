import algoliasearch from 'algoliasearch'
import axios from 'axios'
 
const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
)

export default async function handler(req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.json({ message: 'Bad request' })
    return
  }

  const { created, updated, deleted } = req.body
  const algoliaIndex = algolia.initIndex('og-gallery')

  for (let data of created) {
    if (data !== null)
      await algoliaIndex.saveObject({
        objectID: id,
        slug: data.slug,
        title: data.title,
        type: data.type,
      })
  }

  for (let data of updated) {
    if (data !== null)
      await algoliaIndex.partialUpdateObject({
        objectID: id,
        slug: data.slug,
        title: data.title
      })
  }

  for (let data of deleted) {
    if (data !== null) await algoliaIndex.deleteObject(data.id)
  }

  return res.status(200).send('ok')
}
