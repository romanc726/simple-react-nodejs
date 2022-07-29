import React from 'react'

import BlockContent from '@components/block-content'
import {
  ProductGallery,
  ProductPrice,
  ProductForm,
  ProductActions,
} from '@components/product'

const ProductHero = ({ product, activeVariant, onVariantChange, currentOpSetting }) => {
  const heroBG = currentOpSetting?.color?.hex ?? 'var(--pageBG)'
  return (
    <section className="product">
      <div className="product--content">
        <div className="product--gallery" style={{ backgroundColor: heroBG }}>
          <ProductGallery
            photosets={product.photos.main}
            activeVariant={activeVariant}
            hasArrows
            hasCounter
          />
        </div>

        <div className="product--details" style={{ backgroundColor: heroBG }}>
          <div className="product--info">
            <div className="product--header">
              <div className="product--title">
                {activeVariant && (
                  <div className="product--variant">
                    {/* {activeVariant.title} */}

                    {activeVariant.lowStock && activeVariant.inStock && (
                      <span className="label is-active">1 of 1</span>
                    )}

                    {!activeVariant.inStock && (
                      <span className="label is-secondary is-active">
                        Out of Stock
                      </span>
                    )}
                  </div>
                )}
                <h1 className="product--name">{product.title}</h1>
              </div>

              <ProductPrice
                price={activeVariant?.price || product.price}
                comparePrice={
                  activeVariant?.comparePrice || product.comparePrice
                }
              />
            </div>

            {product.description && (
              <div className="product--desc">
                <BlockContent blocks={product.description} />
              </div>
            )}

            <ProductForm
              product={product}
              activeVariant={activeVariant}
              onVariantChange={onVariantChange}
              className="product--form"
            />

            <ProductActions
              activeVariant={activeVariant}
              klaviyoAccountID={product.klaviyoAccountID}
              style={{ backgroundColor: heroBG }}
              product={product}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductHero
