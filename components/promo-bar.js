import React, { useMemo } from 'react'
import { useRouter } from 'next/router'

import { ConditionalWrapper } from '@lib/helpers'

import CustomLink from '@components/link'

const PromoBar = React.memo(({ data = {} }) => {
  const { enabled, display, text, externalURL, link } = data
  const router = useRouter()

  // bail if no display or text
  if (!enabled || !display || !display.trim() || !text) return null

  // bail if display set to homepage and we're not on the homepage
  if (display === 'home' && router.asPath !== '/') return null

  const realLink = useMemo(
    () => link ? { page: link } : externalURL ? { url: externalURL } : null,
    [link, externalURL]
  )

  return (
    <div className="promo-bar">
      <div className="promo-bar--content">
        <ConditionalWrapper
          condition={realLink}
          wrapper={(children) => (
            <CustomLink
              className="promo-bar--link"
              link={realLink}
            >
              {children}
            </CustomLink>
          )}
        >
          {text}
        </ConditionalWrapper>
      </div>
    </div>
  )
})

export default PromoBar
