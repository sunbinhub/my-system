<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 15, 30]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    totalCount: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      currentPage: 1, //当前页
      total: null, //总共多少条数据
      limit: 10, //每页1条数据
      page: 1 //第几页
    };
  },
  created() {
    this.$emit("paginationChange", { limit: this.limit, page: this.page });
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val;
      this.$emit("paginationChange", { limit: val, page: this.page });
    },
    handleCurrentChange(val) {
      this.page = val;
      this.$emit("paginationChange", { limit: this.limit, page: val });
    }
  }
};
</script>

<style></style>
