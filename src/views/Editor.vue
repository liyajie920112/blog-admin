<template>
  <div class="editor-wrapper">
    <div class="editor-header">
      <div class="input">
        <input type="text" v-model="blog.title" placeholder="请输入标题...">
      </div>
      <div class="operate">
        <a class="tool" href="javascript:;">
          <a-icon type="fullscreen"/>
        </a>
        <a class="tool" href="javascript:;">
          <a-icon type="picture" />
        </a>
        <a class="tool" @click="publish(false)" href="javascript:;">存草稿</a>
        <a class="tool" @click="publish(true)" href="javascript:;">发布</a>
        <a class="tool" @click="showSeo(true)" href="javascript:;">SEO</a>
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
    <div class="seo-wrapper" :class="{ hide: isShowSeo }">
      <a-form>
        <a-form-item label="分类">
          {{blog.category}}
          <a-select placeholder="请选择博客分类">
            <a-select-option v-for="item in menus" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="唯一的博客名称">
          <a-input v-model="blog.unionname" placeholder="请输入唯一的博客名称"/>
        </a-form-item>
        <a-form-item label="Banner">
          <a-upload
            name="avatar"
            listType="picture-card"
            class="avatar-uploader"
            :showUploadList="false"
            action="//jsonplaceholder.typicode.com/posts/"
            :beforeUpload="beforeUpload"
            @change="handleUploadBanner"
          >
            <img v-if="blog.banner" :src="'https://www.liyajie.net' + blog.banner" alt="avatar" />
            <div v-else>
              <a-icon :type="uploadBannerLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="摘要">
          <a-textarea v-model="blog.summary" placeholder="请输入摘要" :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
        <a-form-item label="tags">
          <a-input v-model="blog.tags" placeholder="请输入标签, 已英文逗号分隔"/>
        </a-form-item>
        <a-form-item label="keywords">
          <a-input v-model="blog.keywords" placeholder="请输入关键字, 已英文逗号分隔"/>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="publish(true)">保存</a-button>
          <a-button @click="showSeo(false)">关闭</a-button>
        </a-form-item>
      </a-form>
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
import saveblog from '../apollo/mutations/saveblog.gql'
export default {
  data() {
    return {
      editor: null,
      blog: {
        _id: 0,
        title: '',
        content: '',
        ispublish: false,
        ismarkdown: true,
        summary: '',
        tags: '',
        banner: '',
        unionname: '',
        category: {
          text: '',
          value: ''
        },
        keywords: ''
      },
      menus: [],
      html: '',
      isShowSeo: true,
      checkNick: false,
      uploadBannerLoading: false,
      bannerUrl: ''
    }
  },
  created() {},
  apollo: {
    blog: {
      prefetch: false,
      query: blog,
      variables() {
        const { id } = this.$route.params
        this.blog._id = id
        return {
          id
        }
      },
      update(data) {
        const { blog, menus } = data
        this.menus = menus
        return data
      },
      result({ data, loading, networkStatus }) {
        this.editor.setValue(data.blog.content)
        this.editor.moveCursorTo(0, 0)
        this.$nextTick(() => {
          this.editor.resize()
        })
      }
    }
  },
  methods: {
    showSeo(flag) {
      this.isShowSeo = !this.isShowSeo
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('只可以上传.jpg格式图片')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须 < 2MB!')
      }
      return isJPG && isLt2M
    },
    handleUploadBanner(info) {
      if (info.file.status === 'uploading') {
        this.uploadBannerLoading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.blog.banner = imageUrl
          this.uploadBannerLoading = false
        })
      }
    },
    /**
     * 发布
     */
    publish(ispublish) {
      this.$apollo.mutate({
        mutation: saveblog,
        variables: {
          input: {
            ...blog,
            ispublish
          }
        }
      })
    },
    handleChange() {}
  },
  mounted() {
    hljs.initHighlightingOnLoad()
    const md = new MarkdownIt({
      highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value
          } catch (__) {}
        }
        return '' // use external default escaping
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
  .seo-wrapper {
    position: absolute;
    padding: 15px;
    top: 0;
    right: 0;
    height: 100vh;
    width: 300px;
    border-left: 1px solid #eee;
    background-color: #fff;
    z-index: 101;
    transition: all .5s;
    overflow: auto;
    &.hide {
      transform: translateX(100%);
    }
    /deep/ .ant-form-item {
      margin-bottom: 8px;
    }
    /deep/ .avatar-uploader > .ant-upload {
      width: 256px;
      height: 128px;
    }
    /deep/ .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    /deep/ .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }
}
</style>
