import {
  FaApple,
  FaFacebookF,
  FaInstagram,
  FaDiscord,
  FaOpensea,
  FaTwitter,
  FaYoutube,
  FaGithub
} from 'react-icons/fa'

const getIcon = icon => {
  switch (icon) {
    case 'Apple':
      return FaApple
    case 'Facebook':
      return FaFacebookF
    case 'Instagram':
      return FaInstagram
    case 'Discord':
      return FaDiscord
    case 'Opensea':
      return FaOpensea
    case 'Twitter':
      return FaTwitter
    case 'YouTube':
      return FaYoutube
    case 'Discord':
      return FaDiscord
    default:
      return false
  }
}

export default {
  title: 'Social Link',
  name: 'socialLink',
  type: 'object',
  options: {
    columns: 2,
    collapsible: false
  },
  fields: [
    {
      title: 'Icon',
      name: 'icon',
      type: 'string',
      options: {
        list: [
          { title: 'Apple', value: 'Apple' },
          { title: 'Facebook', value: 'Facebook' },
          { title: 'Instagram', value: 'Instagram' },
          { title: 'Discord', value: 'Discord' },
          { title: 'Opensea', value: 'Opensea' },
          { title: 'Twitter', value: 'Twitter' },
          { title: 'YouTube', value: 'YouTube' },
          { title: 'Discord', value: 'Discord' }
        ]
      }
    },
    {
      title: 'URL',
      name: 'url',
      type: 'url'
    }
  ],
  preview: {
    select: {
      icon: 'icon',
      url: 'url'
    },
    prepare({ icon, url }) {
      return {
        title: icon,
        subtitle: url ? url : '(url not set)',
        media: getIcon(icon)
      }
    }
  }
}
