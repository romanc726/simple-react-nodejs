import customImage from './custom-image'

export default ({ hasDisplayOptions = true, ...props } = {}) => {
  const crops = [
    { title: 'Original', value: 0 },
    { title: '1 : 1 (square)', value: 1 },
    { title: '5 : 7', value: 0.7142857143 },
    { title: '4 : 6', value: 0.6666666667 },
    { title: '16 : 9', value: 1.7777777778 }
  ]

  return {
    title: 'Video',
    name: 'video',
    type: 'object',
    fields: [
      {
        title: 'Source Type',
        name: 'srcType',
        type: 'string',
        options: {
          list: [
            { title: 'Video File', value: 'video' },
            { title: 'Vimeo Id', value: 'vimeoId' },
            { title: 'Video Url', value: 'videoUrl' },
            { title: 'Youtube Id', value: 'youtubeId' }
          ],
          layout: 'radio',
          direction: 'horizontal'
        },
        validation: Rule => Rule.required()
      },
      {
        title: 'Video File',
        name: 'video',
        type: 'file',
        description: 'Select a Video File to show a looping video.',
        hidden: ({ parent }) => {
          return parent.srcType !== 'video'
        }
      },
      {
        title: 'Vimeo Id',
        name: 'vimeoId',
        type: 'string',
        description: 'Enter a vimeo ID to show a looping video.',
        hidden: ({ parent }) => {
          return parent.srcType !== 'vimeoId'
        }
      },
      {
        title: 'Video Url',
        name: 'videoUrl',
        type: 'string',
        description: 'Enter the URL of the video file to show a looping video.',
        hidden: ({ parent }) => {
          return parent.srcType !== 'videoUrl'
        }
      },
      {
        title: 'Youtube Video Id',
        name: 'youtubeId',
        type: 'string',
        description: 'Enter the Id of the Youtube video to show a looping video.',
        hidden: ({ parent }) => {
          return parent.srcType !== 'youtubeId'
        }
      },
      {
        title: 'Display Size (aspect ratio)',
        name: 'customRatio',
        type: 'number',
        options: {
          isHighlighted: true,
          list: crops
        },
        validation: Rule => {
          return Rule.custom((field, context) =>
            'asset' in context.parent && field === undefined
              ? 'Required!'
              : true
          )
        }
      },
      {
        title: 'Poster Image',
        name: 'posterImage',
        type: 'object',
        fields: [
          customImage()
        ],
        description: 'This is the cover image of video.'
      },
      {
        title: 'Alternative text',
        name: 'alt',
        type: 'string',
        description: 'Important for SEO and accessiblity.'
      }
    ],
    preview: {
      select: {
        asset: 'asset',
        alt: 'asset.alt',
        customAlt: 'alt',
        customRatio: 'customRatio'
      },
      prepare({ alt, customAlt, customRatio, asset }) {
        const crop = crops.find(crop => crop.value === customRatio)

        return {
          title: customAlt ?? alt ?? '(alt text missing)',
          subtitle: crop.title,
          media: asset
        }
      }
    },
    ...props
  }
}
