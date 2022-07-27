import { Stack } from 'phosphor-react'

import customImage from '../../lib/custom-image'

export default {
  title: 'Cart Upsell Products',
  name: 'productCartUpsellProducts',
  type: 'object',
  icon: Stack,
  fields: [
    {
      title: 'Which Variants is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        from: 'options',
        fromData: { title: 'name' },
        joinWith: 'values'
      }
    },
    customImage({
      title: 'Thumbnail',
      name: 'cartPhoto'
    }),
    {
      title: 'Display Title',
      name: 'title',
      type: 'string'
    },
    {
      title: 'Product',
      name: 'block',
      type: 'array',
      of: [
        {
          title: 'Product',
          type: 'reference',
          to: [{ type: 'product' }]
        }
      ]
    },
  ],
  preview: {
    select: {
      cartPhoto: 'cartPhoto',
      title: 'title'
    },
    prepare({ cartPhoto, title }) {
      return {
        title: title,
        media: cartPhoto ? cartPhoto : null
      }
    }
  }
}
