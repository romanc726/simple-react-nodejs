import React, { useState } from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'
import { useDebouncedCallback } from 'use-debounce';

import { fadeAnim } from '@lib/animate'
import { useToggleMegaNav } from '@lib/context'

const SearchNavigation = () => {
  const toggleMegaNav = useToggleMegaNav()
  const [hits, setHits] = useState([])

  const fetchResult = useDebouncedCallback(
    async (query) => {
      const results = await fetch("/api/algolia/search-products", {
        method: 'POST',
        body: query
      }).then(re => re.json())
      setHits(results.hits)
    },
    500,
    { maxWait: 2000 }
  )

  return (
    <m.div
      initial="hide"
      animate="show"
      exit="hide"
      variants={fadeAnim}
      className="px-150 py-50"
      onAnimationComplete={(v) => console.log(v)}
    >
      <div className="control--group is-inline is-clean">
        <div className="control">
          <label htmlFor="search-box" className="control--label">
            What are you looking for?
          </label>
          <input
            id="search-box"
            type="text"
            aria-hidden="true"
            onFocus={(e) => {
              e.target.parentNode.classList.add('is-filled')
            }}
            onBlur={(e) => {
              const value = e.target.value
              e.target.parentNode.classList.toggle('is-filled', value)
            }}
            onChange={(e) => {
              const value = e.target.value
              e.target.parentNode.classList.toggle('is-filled', value)
              fetchResult(value)
            }}
          />
        </div>
      </div>
      <div className="my-50">
        <div className='text-20'>Search Result</div>
        <div className='grid grid-cols-3 gap-10 mt-20'>
          {hits.map(({ title, slug }) => (
            <Link href={`/products/${slug}`}>
              <a
                className='text-20'
                onClick={() => toggleMegaNav(false)}
              >
                {title}
              </a>
            </Link>
          ))}
        </div>
      </div>
    </m.div>
  )
}

export default SearchNavigation
