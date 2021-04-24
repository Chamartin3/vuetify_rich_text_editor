<template lang="pug">
.editor
  editor-menu-bar(:editor="editor", v-slot="{ commands, isActive }")
    .menubar
      button.menubar__button(:class="{ 'is-active': isActive.bold() }", @click="commands.bold")
        v-icon(name="bold") fas fa-bold
      |
      button.menubar__button(:class="{ 'is-active': isActive.italic() }", @click="commands.italic")
        v-icon(name="italic") fas fa-italic
      |
      button.menubar__button(:class="{ 'is-active': isActive.strike() }", @click="commands.strike")
        v-icon(name="strike") fas fa-strikethrough
      |
      button.menubar__button(:class="{ 'is-active': isActive.underline() }", @click="commands.underline")
        v-icon(name="underline") fas fa-underline

      |
      button.menubar__button(:class="{ 'is-active': isActive.paragraph() }", @click="commands.paragraph")
        v-icon(name="paragraph") fas fa-paragraph
      |
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 1 }) }", @click="commands.heading({ level: 1 })")
        | H1
      |
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 2 }) }", @click="commands.heading({ level: 2 })")
        | H2
      |
      button.menubar__button(:class="{ 'is-active': isActive.heading({ level: 3 }) }", @click="commands.heading({ level: 3 })")
        | H3
      |
      button.menubar__button(:class="{ 'is-active': isActive.bullet_list() }", @click="commands.bullet_list")
        v-icon(name="ul") fas fa-list
      |
      button.menubar__button(:class="{ 'is-active': isActive.ordered_list() }", @click="commands.ordered_list")
        v-icon(name="ol") fas fa-list-ol
      |
      button.menubar__button(@click="commands.horizontal_rule")
        | ___
      |
      button.menubar__button(@click="commands.undo")
        v-icon(name="undo") fas fa-undo
      |
      button.menubar__button(@click="commands.redo")
        v-icon(name="redo") fas fa-redo

      v-menu(
        :close-on-content-click='false'
        v-model="menu_url")
        template(v-slot:activator="{ on }")
          button.menubar__button(v-on="on",
          :class="{ 'is-active': isActive.link() }")
            v-icon fas fa-link
        v-card
          v-container()
            v-text-field(type="text" label="URL del link", v-model="link_url")
            v-btn(text color="primary" @click="setLinkUrl(commands.link, link_url)" ) Agregar

      v-menu(
        :close-on-content-click='false'
        v-model="menu_video")
        template(v-slot:activator="{ on }")
          button.menubar__button(v-on="on",
          :class="{ 'is-active': isActive.link() }")
            v-icon fab fa-youtube
        v-card
          v-container()
            v-text-field(type="text" label="URL en YouTube", v-model="video_url", :error-messages="video_errors")
            v-btn(text color="primary" @click="videoAdd(commands.iframe, video_url)" ) Agregar


      v-menu(
        v-if="items"
        :close-on-content-click='false'
        v-model="menu_items")
        template(v-slot:activator="{ on }")
          button.menubar__button(v-on="on",
          :class="{ 'is-active': isActive.link() }")
            v-icon fas fa-user-tie
        v-card
          v-container()
            itemsList(:items="items" @selected="itemAdd(commands.teacher,$event)")

  EditorContent.text-lg-left(class="editor__content"  :editor="editor" id="textarea")
</template>
<script>
import './styles.scss'
import itemsList from './itemsList'

import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Image,
  Placeholder
} from 'tiptap-extensions'

export default {
  name: 'RichTextEditorVuetify',
  components: { EditorContent, EditorMenuBar, itemsList },
  props: ['teachers', 'files', 'images'],
  data () {
    return {
      menu_url: false,
      menu_items: false,
      menu_video: false,

      link_url: '',
      video_url: '',
      video_errors: null,
      editor: null
    }
  },
  mounted () {
    if (this.$attrs.value) this.createEditor(this.$attrs.value)
    else this.createEditor()
  },
  methods: {
    createEditor (content = '') {
      // console.log(File)
      // let i = new File()
      // console.log(i)
      this.editor = new Editor({
        extensions: [
          new Blockquote(),
          // new CustomImage(),
          // new Iframe(),
          // new Teacher(),
          // new File(),
          // new File(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Escriba aqui el mensaje',
            showOnlyWhenEditable: true
          })
        ],
        content: content,
        onUpdate: ({ getJSON, getHTML }) => {
          this.$emit('input', getHTML())
        }
      })
      console.log(this.edito)
    },
    setLinkUrl (command, url) {
      command({ href: url })
      this.menu_url = false
      this.link_url = ''
    },
    itemAdd (command, data) {
      command({ id: data.id, label: data.name })
    },
    videoAdd (command, url) {
      let is_youtube = url.includes('https://www.youtube.com/')
      if (is_youtube) {
        let newurl = url.replace('watch?v=', 'embed/')
        command({ src: newurl })
        this.menu_video = false
        this.video_url = ''
        this.video_errors = null
      } else {
        this.video_errors = 'Error La url debe ser un link completo de https://www.youtube.com'
      }
    }
  },
  beforeDestroy () {
    if (this.editor) this.editor.destroy()
  }
}
</script>
