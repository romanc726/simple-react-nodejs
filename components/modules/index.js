import React from 'react'
import dynamic from 'next/dynamic'

const Grid = dynamic(() => import('./grid'))
const Hero = dynamic(() => import('./hero'))
const Marquee = dynamic(() => import('./marquee'))
const DividerPhoto = dynamic(() => import('./divider-photo'))
const ProductHero = dynamic(() => import('./product-hero'))
const Collection = dynamic(() => import('./collection-grid'))
const Newsletter = dynamic(() => import('../newsletter'))

export const Module = ({
  index,
  module,
  product,
  activeVariant,
  onVariantChange,
  collectionProducts,
}) => {
  const type = module._type

  const opNameValueList = activeVariant?.options?.map((op) => {
    return op.name + ':' + op.value
  })

  const currentOpSetting = product?.optionSettings?.find((ops) => opNameValueList.indexOf(ops.forOption) > -1)

  switch (type) {
    case 'grid':
      return <Grid index={index} data={module} />
    case 'hero':
      return <Hero index={index} data={module} />
    case 'marquee':
      return <Marquee index={index} data={module} />
    case 'dividerPhoto':
      return <DividerPhoto index={index} data={module} />
    case 'productHero':
      return (
        <>
          <ProductHero
            index={index}
            product={product}
            activeVariant={activeVariant}
            onVariantChange={onVariantChange}
            currentOpSetting={currentOpSetting}
          />
          {activeVariant?.variantModules?.map((md, key) => (
            md._type === 'grid' ? <Grid index={key} data={md} /> :
              md._type === 'hero' ? <Hero index={key} data={md} /> :
                md._type === 'marquee' ? <Marquee index={key} data={md} /> :
                  md._type === 'dividerPhoto' ? <DividerPhoto index={key} data={md} /> : null
          ))}
        </>
      )
    case 'collectionGrid':
      return (
        <Collection
          index={index}
          data={{ ...module, products: collectionProducts }}
        />
      )
    case 'codeBlock':
      return (
        <section className="section" dangerouslySetInnerHTML={{ __html: module.code }}/>
      )
    case 'newsletter':
      return (
        <section className="section">
          <Newsletter index={index} data={module} />
        </section>
      )
    default:
      return null
  }
}
