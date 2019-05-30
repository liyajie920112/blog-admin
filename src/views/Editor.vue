<template>
  <div class="editor-wrapper">
    <div class="editor-header">
      <div class="input">
        <input type="text" v-model="result.blog.title" placeholder="请输入标题...">
      </div>
      <div class="operate">
        <a class="tool" href="javascript:;">
          <a-icon @click.stop="insertImg('insertImg')" type="picture" />
          <input type="file" ref="insertImg" v-show="false" @change="insertContentImg($event, 0)">
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
          <a-select @change="handleSelectChange" :value="result.blog.category._id" placeholder="请选择博客分类">
            <a-select-option v-for="item in result.menus" :key="item._id">{{item.text}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="唯一的博客名称">
          <a-input v-model="result.blog.unionname" placeholder="请输入唯一的博客名称"/>
        </a-form-item>
        <a-form-item label="Banner">
          <div class="upload-banner" @click="insertImg('insertBanner')">
            <img v-if="result.blog.banner" :src="bannerUrl" alt="avatar" />
            <div class="banner-content" v-else>
              <a-icon :type="uploadBannerLoading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">Upload</div>
            </div>
            <input type="file" ref="insertBanner" @change="insertBannerImg($event, 1)" v-show="false">
          </div>
        </a-form-item>
        <a-form-item label="摘要">
          <a-textarea v-model="result.blog.summary" placeholder="请输入摘要" :autosize="{ minRows: 2, maxRows: 6 }" />
        </a-form-item>
        <a-form-item label="tags">
          <a-input v-model="result.blog.tags" placeholder="请输入标签, 已英文逗号分隔"/>
        </a-form-item>
        <a-form-item label="keywords">
          <a-input v-model="result.blog.keywords" placeholder="请输入关键字, 已英文逗号分隔"/>
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
import { saveblog, upload as uploadimg } from '../apollo/mutations'
import { blog, menus } from '../apollo/queries'
export default {
  data() {
    return {
      editor: null,
      result: {
        blog: {
          _id: '',
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
            _id: ''
          },
          keywords: ''
        },
        menus: []
      },
      html: '',
      isShowSeo: true,
      checkNick: false,
      uploadBannerLoading: false,
      bannerUrl: ''
    }
  },
  created() {
    const { id } = this.$route.params
    if (id) {
      this.getBlogModel(id)
    } else {
      this.getMenus()
    }
  },
  methods: {
    async getBlogModel(id) {
      const res = await this.$apollo.query({
        query: blog,
        variables: {
          id
        }
      })
      const { data } = res
      this.result = data
      this.bannerUrl = data.config.domain + data.blog.banner
      this.result.blog._id = id
      this.$nextTick(() => {
        this.editor.setValue(data.blog.content)
        this.editor.moveCursorTo(0, 0)
        this.editor.resize()
      })
    },
    async getMenus() {
      const res = await this.$apollo.query({
        query: menus
      })
      const { data } = res
      this.result.menus = data.menus
    },
    handleSelectChange(item, op) {
      this.result.blog.category._id = item
    },
    insertImg(refKey) {
      this.$refs[refKey].click()
    },
    async uploadImg(e, type) {
      const { files } = e.target
      if (!files || files.length <= 0) {
        return
      }
      const file = files[0]
      const res = await this.$apollo.mutate({
        mutation: uploadimg,
        client: 'upload',
        variables: {
          file: file,
          type
        }
      })
      const { domain, path } = res.data.singleUpload
      return {
        domain,
        path
      }
    },
    async insertContentImg(e, type) {
      const { domain, path } = await this.uploadImg(e, type)
      this.editor.insert(`![](${domain}${path})`)
    },
    async insertBannerImg(e, type) {
      const { domain, path } = await this.uploadImg(e, type)
      this.result.blog.banner = path
      this.bannerUrl = domain + path
    },
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
    /**
     * 发布
     */
    async publish(ispublish) {
      if (!this.result.blog.category._id) {
        this.$message.warning('请选择分类')
        this.showSeo(true)
        return
      }
      const params = {
        ...this.result.blog,
        category: this.result.blog.category._id,
        ispublish,
        ismarkdown: true
      }
      const res = await this.$apollo.mutate({
        mutation: saveblog,
        variables: {
          input: params
        }
      })
      const { data } = res
      if (data.data.code === 0) {
        const { objectId } = data.data.data
        if (objectId) {
          this.result.blog._id = objectId
          this.$router.replace('editor/' + this.result.blog._id)
        }
        this.$message.success(data.data.msg)
      } else {
        this.$message.error(data.data.msg)
      }
    }
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
      this.result.blog.content = markdownContent
      this.html = md.render(markdownContent)
    })
  }
}
</script>

<style lang="less" scoped>
.editor-wrapper {
  height: 100vh;
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
    /deep/ .upload-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      border-radius: 4px;
      border: 1px dashed #ddd;
      width: 256px;
      min-height: 128px;
      transition: all .3s;
      &:hover {
        border-color: #0094ff;
      }
      .banner-content {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        cursor: pointer;
        i {
          font-size: 32px;
          color: #999;
        }
      }
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
