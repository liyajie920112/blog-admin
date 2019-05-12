<template>
  <div class="blog-wrapper">
    <div class="filter-wrapper">
      <a-button
        type="primary"
        @click="addBlog"
      >新增</a-button>
    </div>
    <div class="table-wrapper">
      <a-spin :spinning="$apollo.loading">
        <a-table
          :columns="columns"
          :row-key="record => record.title"
          :data-source="blogs.list"
          :pagination="paginationCom"
          :loading="loading"
          @change="handleTableChange"
        ></a-table>
      </a-spin>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import blogs from "../apollo/queries/blogs.gql";
const columns = [
  {
    title: "#",
    width: "50px",
    customRender: (text, record, index) => {
      return index + 1;
    }
  },
  {
    title: "标题",
    dataIndex: "title"
  },
  {
    title: "Author",
    dataIndex: "author.nickname",
    width: "100px"
  },
  {
    title: "分类",
    dataIndex: "category.text",
    width: "100px"
  },
  {
    title: "创建时间",
    dataIndex: "createDate",
    width: "200px",
    customRender: (text, record) => {
      return moment(parseInt(record.createDate)).format("YYYY-MM-DD HH:mm:ss");
    }
  }
];
export default {
  layout: "admin",
  data() {
    return {
      blogs: {
        list: [],
        pagination: {
          pageIndex: 1,
          pageSize: 10,
          total: 0
        }
      },
      pagination: {
        current: 1,
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal(total) {
          return `共 ${total} 条`;
        },
        pageSize: 10,
        total: 0
      },
      loading: false,
      columns
    };
  },
  computed: {
    paginationCom() {
      return {
        ...this.pagination,
        current: this.blogs.pagination.pageIndex,
        pageSize: this.blogs.pagination.pageSize,
        total: this.blogs.pagination.total
      };
    }
  },
  apollo: {
    blogs: {
      prefetch: true,
      query: blogs,
      variables() {
        return {
          pageIndex: this.pagination.current,
          pageSize: this.pagination.pageSize
        };
      }
    }
  },
  methods: {
    addBlog() {
      // console.log(this.blogs)
    },
    handleTableChange(page, pageSize) {
      this.$apollo.queries.blogs.fetchMore({
        variables: {
          pageIndex: page.current,
          pageSize: page.pageSize
        },
        // 用新数据转换之前的结果
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.blogs = fetchMoreResult;
          return fetchMoreResult;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.blog-wrapper {
  .filter-wrapper {
    padding: 10px;
  }
  .table-wrapper {
    padding: 0 10px;
  }
}
</style>