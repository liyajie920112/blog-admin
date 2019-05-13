<template>
  <div class="editor-wrapper">
    <div class="editor-p">
      <div class="editor" id="editor"></div>
    </div>
    <div class="html" v-html="html"></div>
  </div>
</template>

<script>
import ace, { require } from 'ace-builds'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-tomorrow'
import hljs from 'highlight.js'
import marked from 'marked'
export default {
  data() {
    return {
      editor: null,
      blog: {
        content: ''
      },
      html: ''
    }
  },
  mounted() {
    hljs.initHighlightingOnLoad()

    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: (code, lang) => {
        return hljs.highlightAuto(code).value
      }
    })
    this.editor = ace.edit('editor')
    //设置代码语言，对应mode-*.js文件
    this.editor.session.setMode('ace/mode/markdown')
    //设置编辑器样式，对应theme-*.js文件
    this.editor.setTheme('ace/theme/tomorrow')

    //设置打印线是否显示
    this.editor.setShowPrintMargin(false)
    //设置是否只读
    this.editor.setReadOnly(false)

    this.editor.setHighlightActiveLine(false)
    this.editor.session.setUseWrapMode(true)
    this.editor.session.setTabSize(4)

    //以下部分是设置输入代码提示的，如果不需要可以不用引用ext-language_tools.js
    // ace.require("ace/ext/language_tools")
    this.editor.setOptions({
      // enableBasicAutocompletion: true,
      // enableSnippets: false,
      // enableLiveAutocompletion: true,
      showGutter: false,
      showPrintMargin: false,
      fontSize: 15
    })
    this.editor.on('change', e => {
      const markdownContent = this.editor.getValue()
      this.blog.content = markdownContent
      this.html = marked(markdownContent)
    })
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper {
  height: 100%;
  display: flex;
  .editor-p {
    height: 100%;
    width: 50%;
    flex: 1;
    .editor {
      height: 100%;
    }
  }
  .html {
    flex: 1;
    border-left: 1px solid #000;
    height: 100%;
  }
}
</style>
