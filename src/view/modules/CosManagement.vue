<template>
  <el-container id="cos-management">
    <el-header
      style="border-bottom: 1px solid #ddd; padding:0; height:40px; line-height:40px;margin-bottom: 10px;"
    >
      <span>服务类别管理</span>
    </el-header>
    <el-container>
      <el-aside
        style="width: 200px; margin-right: 5px; border: 1px solid #ddd;"
        :style="platformAsideHeight"
      >
        <AsideTree
          :dataTree="dataTree"
          :defaultProps="defaultProps"
          @nodeClick="getNodeId"
          @dateTree="getDataTree"
        ></AsideTree>
      </el-aside>
      <el-container>
        <el-header style="height:30px;">
          <el-row type="flex" class="row-bg" justify="end">
            <el-col :span="10">
              <SearchInput
                @searchValue="searchOrganization"
                placeholder="请输入服务小类名称/ID"
              ></SearchInput>
            </el-col>
            <el-col :span="6">
              <el-button size="mini" @click="searchTable">
                查询
              </el-button>
              <el-button type="primary" size="mini" @click="dialogShow = true">
                新增
              </el-button>
            </el-col>
          </el-row>
          <el-dialog
            :visible.sync="dialogShow"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
          >
            <AddClass></AddClass>
          </el-dialog>
        </el-header>
        <el-main style="padding:0;">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            :height="tableHeight"
          >
            <el-table-column
              prop="categoryCode"
              label="服务项目代码"
              width="150"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="categoryName"
              label="服务项目名称"
              width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="remark"
              label="描述"
              width="150"
              align="center"
            >
            </el-table-column>
            <el-table-column label="操作" width="260">
              <template slot-scope="scope">
                <el-button
                  @click="changeInfo(scope.row)"
                  type="text"
                  size="small"
                >
                  编辑
                </el-button>
                <el-button
                  @click="disabledUser(scope.row)"
                  type="text"
                  size="small"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="page">
            <Pagination :totalCount="totalCount" @paginationChange="getlist">
            </Pagination>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import AsideTree from "@/components/common-components/AsideTree";
import SearchInput from "@/components/common-components/SearchInput";
import Pagination from "@/components/common-components/Pagination";
import AddClass from "@/view/modules/module-component/cm/AddClass";

export default {
  components: {
    AsideTree,
    SearchInput,
    Pagination,
    AddClass
  },
  data() {
    return {
      dataTree: [], //树形结构数据
      //默认值
      defaultProps: {
        children: "children",
        label: "categoryName"
      },
      //左侧高度
      platformAsideHeight: {
        height: ""
      },
      tableData: [], //表格数据
      tableHeight: "", //表格高度
      totalCount: null, //表格数据总条数
      dialogShow: false
    };
  },
  created() {
    window.addEventListener("resize", this.getPlatformAsideHeight); // 注册监听器
    this.getPlatformAsideHeight(); // 页面创建时先调用一次
    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
  },
  methods: {
    getTableHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.tableHeight = window.innerHeight - 256 + "px";
    },
    getPlatformAsideHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.platformAsideHeight.height = window.innerHeight - 172 + "px";
    },
    //获取树型结构
    getDataTree() {
      this.axios
        .get("http://192.168.0.40:9900/api/sm/category/tree/all", {
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            this.dataTree = res.data.data.children;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //获取树形结构节点id
    getNodeId(val) {
      this.nodeClickId = val;
      let data = {
        id: val,
        limit: 10,
        page: 1
      };
      this.getlist(data);
    },
    //设置表格数据
    getlist(data) {
      this.axios
        .get("http://192.168.0.40:9900/api/sm/category/list", {
          params: data,
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            this.tableData = res.data.data.list; //后端返回的表格数据
            this.totalCount = res.data.data.totalCount; // 后端返回的总条数
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //搜索组件
    searchOrganization(val) {
      let data = {
        condition: val, //搜索值
        organizationId: this.nodeClickId, //机构id
        limit: 10,
        page: 1
      };
      this.getlist(data);
    },
    //查询
    searchTable() {
      let data = {
        organizationId: this.nodeClickId, //机构id
        limit: 10,
        page: 1
      };
      this.getlist(data);
    }
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>

<style>
#cos-management .el-dialog {
  margin: 0 auto;
  margin-top: 5px !important;
  width: 70%;
  height: 600px;
}
#cos-management .el-dialog__body {
  padding: 0;
}
#cos-management .el-dialog__header {
  padding: 0;
}
</style>
