import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Error from 'next/error'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { useForm } from 'react-hook-form'

import { getStaticPage, queries } from '@data'

import Layout from '@components/layout'
import Icon from '@components/icon'

const Collection = dynamic(() => import('@components/modules/collection-grid'))

const Search = ({ data, query }) => {
  const router = useRouter()
  const { site, page } = data
  const [submitting, setSubmitting] = useState(false)

  const {
    handleSubmit,
    register,
    watch
  } = useForm()

  // handle form submission
  const onSubmit = (data, e) => {
    e.preventDefault()
    setSubmitting(true)
    if (search !== "") {
      router.push('/search?query=' + search)
    }
  }

  const searchText = register('searchText')
  const search = watch('searchText')

  if (!page) {
    return (
      <Error
        title={`"Shop Page" is not set in Sanity, or the page data is missing`}
        statusCode="Data Error"
      />
    )
  }

  return (
    <Layout site={site} page={page}>
      <form className="form w-350 mx-auto mt-20 mb-50" onSubmit={handleSubmit(onSubmit)}>
        <div className="control--group is-inline is-clean">
          <div className={cx("control", {"is-filled": search !== ""})}>
            <label htmlFor="search" className="control--label">
              What are you looking for?
            </label>

            <input
              id="search"
              name="searchText"
              className='text-16'
              defaultValue={query}
              ref={searchText.ref}
              onKeyDown={(e) => {
                if (e.code == 'Enter') {
                  e.preventDefault()
                  const q = e.target.value.trim();
                  if (q !== "") {
                    router.push('/search?query=' + q)
                    setSubmitting(true)
                  }
                }
              }}
              onFocus={(e) => {
                e.target.parentNode.classList.add('is-filled')
              }}
              onBlur={(e) => {
                const value = e.target.value
                searchText.onBlur(e)
                e.target.parentNode.classList.toggle('is-filled', value)
              }}
              onChange={(e) => {
                const value = e.target.value
                searchText.onChange(e)
                e.target.parentNode.classList.toggle('is-filled', value)
                setSubmitting(false)
              }}
            />
          </div>

          <button
            type="submit"
            className={cx('w-30 h-30 bg-transparent', {
              'is-loading': submitting,
              'is-disabled': submitting || search === "",
            })}
            disabled={submitting || search === ""}
          >
            <Icon name="Search" viewBox="0 0 24 24" />
          </button>
        </div>
      </form>

      {page.products.length === 0 ? (
        <div className='h-350 border-b' />
      ) : (
        <Collection data={{
          title: "Search",
          filter: { groups: [] },
          paginationLimit: 12,
          noFilterResults: [],
          products: page.products
        }}/>
      )}
    </Layout>
  )
}

export async function getServerSideProps({ query, preview, previewData }) {
  const searchKey = query?.query || ""

  const searchQuery = searchKey === "" 
    ? `{"products": []}`
    : `{
      "products":
        *[_type == "product" && !(_id in [${queries.homeID}, ${queries.shopID}, ${queries.errorID}]) && wasDeleted != true && isDraft != true && (title match "${searchKey}*")]
        ${queries.product}
      }`

  const pageData = await getStaticPage(
    searchQuery,
    {
      active: preview,
      token: previewData?.token,
    }
  )

  pageData.page.title = searchKey === "" ? 'Search' : `Search: ${pageData.page.products.length} results for "${searchKey}"`

  return {
    props: {
      data: pageData,
      query: searchKey,
    },
  }
}

export default Search
