import { Stack } from 'phosphor-react'

import customImage from '../../lib/custom-image'
import customVideo from '../../lib/custom-video'

export default {
  title: 'Gallery',
  name: 'productGalleryMedias',
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
    {
      title: 'Gallery Media(s)',
      name: 'photos',
      type: 'array',
      of: [
        customImage(),
        customVideo()
      ],
      options: {
        layout: 'grid'
      }
    }
  ],
  preview: {
    select: {
      medias: 'medias',
      forOption: 'forOption'
    },
    prepare({ medias, forOption }) {
      const option = forOption ? forOption.split(':') : null
      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: medias ? medias[0] : null
      }
    }
  }
}
