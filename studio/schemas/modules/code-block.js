import { Code } from 'phosphor-react'

export default {
  title: 'Code Block',
  name: 'codeBlock',
  type: 'object',
  icon: Code,
  fields: [
    {
      title: 'Code',
      name: 'code',
      type: 'text',
    }
  ],
  preview: {
    prepare() {
      return {
        title: 'Code Block',
      }
    }
  }
}