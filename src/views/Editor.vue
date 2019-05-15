<template>
  <div class="editor-wrapper">
    <div class="editor-header">
      <div class="input">
        <input type="text" v-model="blog.title" placeholder="请输入标题...">
      </div>
      <div class="operate">
        <a class="tool" href="javascript:;"><a-icon type="fullscreen" /></a>
        <a class="tool" @click="publish" href="javascript:;">发布</a>
      </div>
    </div>
    <div class="editor-content">
      <div class="editor-p">
        <div class="editor" id="editor"></div>
      </div>
      <div class="html-wrapper">
        <div class="html" v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/theme-tomorrow'
import hljs from 'highlight.js/lib/index.js'
import 'highlight.js/styles/solarized-light.css'
import '../static/editor.less'
import MarkdownIt from 'markdown-it'
import blog from '../apollo/queries/blog.gql'
export default {
  data() {
    return {
      editor: null,
      blog: {
        _id: 0,
        title: '',
        content: '',
        ispublish: true,
        ismarkdown: true,
        summary: '',
        tags: '',
        banner: '',
        unionname: '',
        category: '',
        keywords: ''
      },
      html: ''
    }
  },
  created() {
  },
  apollo: {
    blog: {
      prefetch: false,
      query: blog,
      variables() {
        const { id } = this.$route.params
        return {
          id
        }
      },
      update(data) {
        return data.blog
      },
      result({ data, loading, networkStatus }) {
        this.editor.setValue(data.blog.content)
        this.editor.moveCursorTo(0, 0);
        this.$nextTick(() => {
          this.editor.resize()
        })
      }
    }
  },
  methods: {
    /**
     * 发布
     */
    publish() {

    }
  },
  mounted() {
    hljs.initHighlightingOnLoad()
    const md = new MarkdownIt({
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) {}
        }
        return ''; // use external default escaping
      }
    })
    this.editor = ace.edit('editor')
    // 设置代码语言，对应mode-*.js文件
    this.editor.session.setMode('ace/mode/markdown')
    // 设置编辑器样式，对应theme-*.js文件
    this.editor.setTheme('ace/theme/tomorrow')

    // 设置打印线是否显示
    this.editor.setShowPrintMargin(false)
    // 设置是否只读
    this.editor.setReadOnly(false)

    this.editor.setHighlightActiveLine(false)
    this.editor.session.setUseWrapMode(true)
    this.editor.session.setTabSize(4)

    this.editor.setOptions({
      showGutter: false,
      showPrintMargin: false,
      fontSize: 15
    })
    this.editor.on('change', () => {
      const markdownContent = this.editor.getValue()
      this.blog.content = markdownContent
      this.html = md.render(markdownContent)
    })
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .editor-header {
    display: flex;
    height: 63px;
    border-bottom: 1px solid #eee;
    color: #000;
    padding: 0 0 0 15px;
    .input {
      flex: 1;
      input {
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        font-size: 26px;
        font-weight: 700;
      }
    }
    .operate {
      display: flex;
      align-items: center;
      padding: 0 15px;
      .tool {
        margin-left: 10px;
      }
    }
  }
  .editor-content {
    display: flex;
    flex: 1;
    .editor-p {
      height: 100%;
      width: 50%;
      flex: 1;
      padding: 10px 0;
      .editor {
        height: 100%;
      }
    }
    .html-wrapper {
      padding: 10px;
      width: 50%;
      flex: 1;
      border-left: 1px solid #eee;
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
