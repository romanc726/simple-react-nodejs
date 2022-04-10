import algoliasearch from 'algoliasearch'

const algolia = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID,
  process.env.ALGOLIA_ADMIN_API_KEY
)

const algoliaIndex = algolia.initIndex('og-gallery')

export default async function send(req, res) {
  if (req.method !== 'POST') {
    console.error('Must be a POST request with a search query')
    return res
      .status(200)
      .json({ error: 'Must be a POST request with a search query' })
  }

  const hits = await algoliaIndex.search(req.body, {
    attributesToRetrieve: ['title', 'slug']
  })

  res.statusCode = 200
  res.json(JSON.stringify(hits))
}
