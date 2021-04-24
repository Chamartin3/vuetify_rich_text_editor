import { Node } from 'tiptap'
import { replaceText } from 'tiptap-commands'

export default class Mention extends Node {

  get name() {
    return 'teacher'
  }

  get defaultOptions() {
    return {
      matcher: {
        allowSpaces: false,
        startOfLine: false,
      },
      mentionClass: 'v-chip v-chip--primary theme--dark v-size--default'
    }
  }

  get schema() {
    return {
      attrs: {
        id: {},
        label: {},
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
        },
        `${node.attrs.label}`,
      ],
      parseDOM: [
        {
          tag: 'span[data-mention-id]',
          getAttrs: dom => {
            const id = dom.getAttribute('data-mention-id')
            const label = dom.innerText.split(this.options.matcher.char).join('')
            return { id, label }
          },
        },
      ],
    }
  }

  commands({ schema }) {
    return attrs => replaceText(null, schema.nodes[this.name], attrs)
  }

}
// <span class="v-chip v-chip--no-color theme--dark v-size--default">
// {{src}} {{name}}
// </span>
