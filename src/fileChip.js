import { Node } from 'tiptap'
import { replaceText } from 'tiptap-commands'

class Mention extends Node {
  constructor () {
    super()
  }

  get name () {
    return 'file'
  }

  get defaultOptions () {
    return {
      matcher: {
        allowSpaces: false,
        startOfLine: false
      },
      mentionClass: 'v-chip theme--dark v-size--default'
    }
  }

  get schema () {
    return {
      attrs: {
        link: {},
        label: {}
      },
      group: 'inline',
      inline: true,
      selectable: false,
      atom: true,
      toDOM: node => [
        'a',
        {
          class: this.options.mentionClass,
          'data-mention-id': node.attrs.id,
          'href': node.attrs.link,
          'target': '_blank',
          'style': 'background-color: rgb(255, 99, 0);'
        },
        `${node.attrs.label}`
      ],
      parseDOM: [
        {
          tag: 'span[data-mention-id]',
          getAttrs: dom => {
            const id = dom.getAttribute('data-mention-id')
            const label = dom.innerText.split(this.options.matcher.char).join('')
            return { id, label }
          }
        }
      ]
    }
  }

  commands ({ schema }) {
    return attrs => replaceText(null, schema.nodes[this.name], attrs)
  }
}

export default Mention
// <span class="v-chip v-chip--no-color theme--dark v-size--default">
// {{src}} {{name}}
// </span>
