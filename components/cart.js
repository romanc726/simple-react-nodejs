import React, { useState, useEffect } from 'react'
import FocusTrap from 'focus-trap-react'
import { m } from 'framer-motion'
import cx from 'classnames'
import Carousel from '@components/carousel'
import Photo from '@components/photo'

import { centsToPrice } from '@lib/helpers'

import {
  useSiteContext,
  useCartTotals,
  useCartCount,
  useCartItems,
  useCheckout,
  useToggleCart,
  useAddItem
} from '@lib/context'

import CartItem from '@components/cart-item'
import { set } from 'lodash'

const Cart = ({ data }) => {
  const { _key: id, shop } = data

  if (!shop) return null

  const { isCartOpen, isUpdating, isAdding } = useSiteContext()
  const { subTotal } = useCartTotals()
  const cartCount = useCartCount()
  const lineItems = useCartItems()
  const checkoutURL = useCheckout()
  const toggleCart = useToggleCart()
  const addItemToCart = useAddItem()

  const [hasFocus, setHasFocus] = useState(false)
  const [checkoutLink, setCheckoutLink] = useState(checkoutURL)

  const handleKeyDown = (e) => {
    if (e.which === 27) {
      toggleCart(false)
    }
  }

  const lineProductIds = lineItems.map((item) => {
    return item.product.slug
  })
  const isFreeShipping = (shop.freeShippingMinimum - centsToPrice(subTotal)) > 0 ? (shop.freeShippingMinimum - (centsToPrice(subTotal) || 0)).toFixed(2) : 'free'

  const freeShppingPercent = isFreeShipping === 'free' ? '100%' : (centsToPrice(subTotal) / shop.freeShippingMinimum) * 100 + '%'

  const goToCheckout = (e) => {
    e.preventDefault()
    toggleCart(false)

    setTimeout(() => {
      window.open(checkoutLink, '_self')
    }, 200)
  }

  const [upsellProducts, setUpsellProducts] = useState([])
  // update our checkout URL to use our custom domain name
  useEffect(() => {
    if (checkoutURL) {
      const buildCheckoutLink = shop.storeURL
        ? checkoutURL.replace(
          /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/g,
          shop.storeURL
        )
        : checkoutURL
      setCheckoutLink(buildCheckoutLink)
    }
  }, [checkoutURL])

  useEffect(() => {
    setUpsellProducts([])
    shop.upsellProducts?.map((up, key) => {
      const pid = up.block[0]?._ref.replace('product-', '') / 1
      shop.allProduct.map((ap, k) => {
        if ((ap.id === pid) && lineProductIds.length > 0 && (lineProductIds.indexOf(ap.slug) === -1)) {
          set(shop.upsellProducts[key], 'product', ap)
        } else if ((ap.id === pid) && lineProductIds.length > 0 && (lineProductIds.indexOf(ap.slug) !== -1)) {
          delete shop.upsellProducts[key]['product']
        }
      })
    })
    setUpsellProducts(shop.upsellProducts?.filter((up) => up.product?.id > 0))
  }, [lineItems])

  return (
    <>
      <FocusTrap
        active={isCartOpen && hasFocus}
        focusTrapOptions={{ allowOutsideClick: true }}
      >
        <m.div
          initial="hide"
          animate={isCartOpen ? 'show' : 'hide'}
          variants={{
            show: {
              x: '0%',
            },
            hide: {
              x: '100%',
            },
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onKeyDown={(e) => handleKeyDown(e)}
          onAnimationComplete={(v) => setHasFocus(v === 'show')}
          className={cx('cart is-inverted', {
            'is-active': isCartOpen,
            'is-updating': isUpdating,
          })}
        >
          <div className="cart--inner">
            <div className="cart--header">
              <div className="cart--title">
                Your Cart <span className="cart--count">{cartCount}</span>
              </div>
              <button className="cart-toggle" onClick={() => toggleCart(false)}>
                CONTINUE SHOPPING
              </button>
            </div>

            {lineItems?.length > 0 && shop.freeShippingMinimum &&
              <div className="cart--shipping">
                <div className="shipping-text">
                  <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#ffffff" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect><path d="M176,80h42.6a7.9,7.9,0,0,1,7.4,5l14,35" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path><line x1="16" y1="144" x2="176" y2="144" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></line><circle cx="188" cy="192" r="24" fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-width="10"></circle><circle cx="68" cy="192" r="24" fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-width="10"></circle><line x1="164" y1="192" x2="92" y2="192" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></line><path d="M44,192H24a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H176V171.2" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path><path d="M176,120h64v64a8,8,0,0,1-8,8H212" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="10"></path>
                  </svg>
                  {
                    isFreeShipping === 'free' ?
                      <>CONGRATS! YOU'VE GOT FREE SHIPPING!</>
                      :
                      <>
                        YOU'RE ${isFreeShipping} AWAY FROM FREE SHIPPING!
                      </>
                  }
                </div>
                <div className="progress-bar" style={{ backgroundColor: '#8f8f8f' }}>
                  <div style={{ width: freeShppingPercent }}></div>
                </div>
              </div>
            }

            <div className="cart--content">
              {lineItems?.length ? (
                <CartItems items={lineItems} />
              ) : (
                <EmptyCart />
              )}
            </div>

            {lineItems?.length > 0 && upsellProducts?.length > 0 &&
              <div className="cart--upsell--product">
                <Carousel
                  id={id}
                  hasDots
                  hasDrag
                >
                  {upsellProducts.map((upsellProduct, key) => (
                    <div key={key} className="slider">
                      <Photo photo={upsellProduct.cartPhoto} className="photo" />
                      <div className="title">
                        {upsellProduct.title}
                      </div>
                      <button
                        className={cx("btn", { 'is-disabled': isAdding })}
                        onClick={() => addItemToCart(
                          upsellProduct.product?.variants[0].id,
                          1
                        )}
                      >
                        {isAdding ? 'ADDING...' : 'ADD'}
                      </button>
                    </div>
                  ))}
                </Carousel>
              </div>
            }

            {lineItems?.length > 0 && (
              <div className="cart--footer">
                <div className="cart--subtotal">
                  <span>Subtotal</span>
                  <span>${centsToPrice(subTotal)}</span>
                </div>

                <a
                  href={checkoutLink}
                  onClick={(e) => goToCheckout(e)}
                  className="btn is-primary is-inverted is-large"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#1c1c1c" viewBox="0 0 256 256">
                    <rect width="256" height="256" fill="none"></rect>
                    <circle cx="128" cy="140" r="12"></circle>
                    <path d="M208,80H172V52a44,44,0,0,0-88,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-72,86.8V184a8,8,0,0,1-16,0V166.8a28,28,0,1,1,16,0ZM156,80H100V52a28,28,0,0,1,56,0Z"></path>
                  </svg>
                  {isUpdating || isAdding ? 'Updating...' : 'Checkout'}
                </a>

                {shop.cartMessage && (
                  <p className="cart--message">{shop.cartMessage.replace('[price]', shop.freeShippingMinimum ?? '')}</p>
                )}
              </div>
            )}
          </div>
        </m.div>
      </FocusTrap>

      <div
        className={cx('cart--backdrop', {
          'is-active': isCartOpen,
        })}
        onClick={() => toggleCart(false)}
      />
    </>
  )
}

const CartItems = ({ items }) => {
  return (
    <div className="cart--items">
      {items.map((item) => {
        return <CartItem key={item.id} item={item} />
      })}
    </div>
  )
}

const EmptyCart = () => (
  <div className="cart--empty">
    <p>Your cart is empty</p>
  </div>
)

export default Cart
