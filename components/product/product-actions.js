import React, { useState, useEffect } from 'react'
import useInView from 'react-cool-inview'
import cx from 'classnames'

import {
  ProductCounter,
  ProductAdd,
  ProductWaitlist,
} from '@components/product'

import { centsToPrice, isBrowser } from '@lib/helpers'

const ProductActions = ({ activeVariant, klaviyoAccountID, style, product }) => {
  // set default quantity
  const [quantity, setQuantity] = useState(1)
  const [isView, setIsView] = useState(false)

  const { observe, inView } = useInView()
  let isViewHeight = false

  useEffect(() => {
    if (isBrowser) {
      isViewHeight = document.onscroll = () => {
        const scrollHeight = Math.max(
          document.body.scrollHeight, document.documentElement.scrollHeight,
          document.body.offsetHeight, document.documentElement.offsetHeight,
          document.body.clientHeight, document.documentElement.clientHeight
        )
        if (window.innerWidth >= 1200 && window.scrollY > 980 && window.scrollY < (scrollHeight - 1100)) {
          setIsView(true)
          return true
        } else if (window.innerWidth >= 768 && window.innerWidth < 1200 && window.scrollY > 980 && window.scrollY < (scrollHeight - 1600)) {
          setIsView(true)
          return true
        } else if (window.innerWidth < 768 && window.scrollY > 980 && window.scrollY < (scrollHeight - 2000)) {
          setIsView(true)
          return true
        } else {
          setIsView(false)
          return false
        }
      }
    }
  }, [isBrowser, isViewHeight])

  return (
    <div className="product--actions" style={style}>
      {activeVariant?.inStock ? (
        <>
          <div className={cx('product--actions--fixed', { 'show-desktop-bar': !inView && isView })} style={style}>
            <div>
              <p className="varient--name">{activeVariant.title}</p>
              <h1 className="product--name">{product.title}</h1>
            </div>
            <div className="action-wrapper">
              <ProductAdd
                productID={activeVariant.id}
                quantity={quantity}
                className="btn is-primary is-large is-fixed-action-bar"
              >
                Add To Cart <span className="hidden sm:inline">| ${centsToPrice(activeVariant.price)}</span>
              </ProductAdd>
            </div>
          </div>
          <div className="flex mt-24">
            {/* <ProductCounter
              id={activeVariant.id}
              max={10}
              onUpdate={setQuantity}
            /> */}
            <ProductAdd
              productID={activeVariant.id}
              quantity={quantity}
              className="btn is-primary is-large is-block"
            >
              Add To Cart <span className="hidden sm:inline">| ${centsToPrice(activeVariant.price)}</span>
            </ProductAdd>
          </div>
          <div className="additional-text hidden lg:block">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect><path d="M176,80h42.6a7.9,7.9,0,0,1,7.4,5l14,35" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path><line x1="16" y1="144" x2="176" y2="144" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></line><circle cx="188" cy="192" r="24" fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="10"></circle><circle cx="68" cy="192" r="24" fill="none" stroke="#000000" stroke-miterlimit="10" stroke-width="10"></circle><line x1="164" y1="192" x2="92" y2="192" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></line><path d="M44,192H24a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H176V171.2" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path><path d="M176,120h64v64a8,8,0,0,1-8,8H212" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path>
              </svg>FREE SHIPPING ON ORDERS OVER $25
            </div>
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256">
                <rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></circle><circle cx="92" cy="108" r="12"></circle><circle cx="164" cy="108" r="12"></circle><path d="M169.6,152a48.1,48.1,0,0,1-83.2,0" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path>
              </svg>
              <span>100% HAPPINESS GUARANTEED</span>
            </div>
          </div>
          <span ref={observe} />
        </>
      ) : (
        <>
          {klaviyoAccountID ? (
            <ProductWaitlist
              variant={activeVariant.id}
              klaviyo={klaviyoAccountID}
            />
          ) : (
            <div className="btn is-large is-disabled is-block">Sold out</div>
          )}
        </>
      )}
    </div>
  )
}

export default ProductActions
