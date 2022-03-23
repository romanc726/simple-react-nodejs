import algoliasearch from 'algoliasearch'
import axios from 'axios'
 
const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
)

const algoliaIndex = algolia.initIndex('my-index')

export default async function handler(req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    res.status(400)
    res.json({ message: 'Bad request' })
    return
  }

  const { created, updated, deleted } = req.body.ids

  axios({
    url: `https://webhook.site/34f6fbb7-4e02-465d-84a5-cd843b699f3f`,
    method: 'POST',
    data: req.body,
  })

  created.forEach(id => {
    if (id !== null) algoliaIndex.saveObject({ objectID: id })
  })

  updated.forEach(id => {
    if (id !== null) algoliaIndex.partialUpdateObject({ objectID: id })
  })

  deleted.forEach(id => {
    if (id !== null) algoliaIndex.deleteObject({ objectID: id })
  })

  return res.status(200).send('ok')
}
