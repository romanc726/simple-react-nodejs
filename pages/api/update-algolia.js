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

  const { created, updated, deleted } = req.body.ids
  const algoliaIndex = algolia.initIndex('my-index')

  for (let id of created) {
    if (id !== null) await algoliaIndex.saveObject({ objectID: id })
  }

  for (let id of updated) {
    if (id !== null) await algoliaIndex.partialUpdateObject({ objectID: id })
  }

  for (let id of deleted) {
    if (id !== null) await algoliaIndex.deleteObject(id)
  }

  return res.status(200).send('ok')
}
