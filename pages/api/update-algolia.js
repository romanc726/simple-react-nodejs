import algoliasearch from 'algoliasearch'
 
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
