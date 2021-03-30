<template>
  <el-container>
    <!-- 头部开始 -->
    <el-header
      style="border-bottom: 1px solid #ddd; padding:0; height:40px; line-height:40px;margin-bottom: 10px;"
    >
      <span>平台机构管理</span>
    </el-header>
    <!-- 头部结束 -->
    <!-- 主体部分开始 -->
    <el-container>
      <!-- 左侧树形结构开始 -->
      <el-aside
        style="width: 200px; margin-right: 5px; border: 1px solid #ddd;"
        :style="platformAsideHeight"
      >
        <AsideTree
          :dataTree="organizationData"
          @handleClick="getNodeId"
          @dateTree="getOrganization()"
        ></AsideTree>
      </el-aside>
      <!-- 左侧树形结构结束 -->
      <!-- 右侧主体开始 -->
      <el-main class="organization-main">
        <el-container>
          <!-- 右侧头部开始 -->
          <el-header class="organization-header">
            <el-row>
              <el-col :span="18">
                <el-select v-model="organizationStatus" size="mini">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="在用" value="0"></el-option>
                  <el-option label="停用" value="1"></el-option>
                </el-select>

                <SearchInput
                  @searchValue="searchOrganization"
                  placeholder="请输入组织名称/ID"
                ></SearchInput>
              </el-col>
              <el-col :span="6">
                <el-button type="info" size="mini">查询</el-button>
                <el-button
                  type="primary"
                  @click="dialogFormVisible = true"
                  size="mini"
                >
                  新增
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <!-- 右侧头部结束 -->
          <!-- 右侧表格开始 -->
          <el-main style="padding-bottom:0;padding:0;">
            <template>
              <el-table
                :data="tableData"
                style="width: 100%;"
                row-key="id"
                :height="tableHeight"
                @cell-click="cellClick"
                border
                :tree-props="{
                  children: 'children',
                  hasChildren: 'hasChildren'
                }"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="100"
                  sortable
                ></el-table-column>
                <el-table-column prop="id" label="角色ID" width="120">
                </el-table-column>
                <el-table-column prop="name" label="组织名称" width="120">
                </el-table-column>
                <el-table-column prop="code" label="组织代码" width="120">
                </el-table-column>
                <el-table-column prop="type" label="组织类型" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 0">机构</span>
                    <span v-if="scope.row.type === 1">科室</span>
                  </template>
                </el-table-column>
                <el-table-column prop="parentName" label="上级组织" width="120">
                </el-table-column>
                <el-table-column prop="disableFlag" label="状态" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.disableFlag === 0">在用</span>
                    <span v-if="scope.row.disableFlag === 1">停用</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="130">
                  <template slot-scope="scope">
                    <el-button
                      @click="changeClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      修改
                    </el-button>
                    <el-button
                      @click="removeClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      删除
                    </el-button>
                    <el-button
                      @click="disableClick(scope.row)"
                      type="text"
                      size="small"
                    >
                      停用
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="page">
                <Pagination
                  :totalCount="totalCount"
                  @paginationChange="getlist"
                >
                </Pagination>
              </div>
            </template>
          </el-main>
          <!-- 右侧表格结束 -->
          <!-- 弹窗开始 -->
          <el-dialog :visible.sync="dialogFormVisible">
            <AddOrganization
              @close="dialogFormVisible = false"
              @refresh="refreshTable"
              :organizationForm="changeOrganization"
              :parentId="userInfo.id"
            ></AddOrganization>
          </el-dialog>
          <!-- 弹窗结束 -->
        </el-container>
      </el-main>
      <!-- 右侧主体结束 -->
    </el-container>
    <!-- 主题部分结束 -->
  </el-container>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import SearchInput from "@/components/common-components/SearchInput";
import Pagination from "@/components/common-components/Pagination";
import AsideTree from "@/components/common-components/AsideTree";
import AddOrganization from "@/view/modules/module-component/pom/AddOrganization";

export default {
  components: {
    SearchInput,
    Pagination,
    mapState,
    mapGetters,
    AddOrganization,
    AsideTree
  },
  data() {
    return {
      //树形结构数据
      organizationData: [],
      //左侧高度
      platformAsideHeight: {
        height: ""
      },
      organizationStatus: "", //组织状态
      //组织表格数据
      tableData: [],
      //选中的表格数据
      multipleSelection: [],
      tableHeight: "", //表格高度
      dialogFormVisible: false, //弹窗是否显示
      totalCount: null, //表格数据总条数
      nodeClickId: null, //组织机构id
      changeOrganization: {}, //修改组织的信息
      parentId: "" //当前用户id
    };
  }, // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    window.addEventListener("resize", this.getPlatformAsideHeight); // 注册监听器
    this.getPlatformAsideHeight(); // 页面创建时先调用一次

    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //获取树型结构
    getOrganization() {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/tree/" + 1, {
          //row.id
          params: { type: "0" },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            this.organizationData = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //设置表格数据
    getlist(data) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/page/" + 3, {
          //this.userInfo.id
          params: data,
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            let tableList = res.data.data.list;
            tableList.forEach(item => {
              this.deleteHasChildren(item);
            });
            this.tableData = tableList; //后端返回的表格数据
            this.totalCount = res.data.data.totalCount; // 后端返回的总条数
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    getPlatformAsideHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.platformAsideHeight.height = window.innerHeight - 172 + "px";
    },
    //搜索功能
    searchOrganization(value) {
      let searchParams = {
        parentId: this.nodeClickId, //机构id
        disableFlag: this.organizationStatus, //状态
        condition: value, //搜索值
        limit: 10, //每页10条
        page: 1 //第一页
      };
      this.getlist(searchParams);
    },
    getTableHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.tableHeight = window.innerHeight - 267 + "px";
    },
    //表格修改事件
    changeClick(row) {
      row.type = row.type.toString(); //解决select option不能对应显示的问题
      this.changeOrganization = row;
      this.dialogFormVisible = true;
    },
    //表格删除事件
    removeClick(row) {
      debugger;
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/organization/delete/" + row.id,
        headers: {
          authorization: this.tokenValue
        }
      }).then(res => {
        //获取表格数据，默认第一页 10条
        if (res.data && res.data.code === 0) {
          this.$message.success("删除组织机构成功！");
          this.getlist({ limit: 10, page: 1 }); //刷新表格数据
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //表格停用事件
    disableClick(row) {
      debugger;
      this.axios({
        method: "post",
        url:
          "http://192.168.0.40:9900/uc/sys/organization/switch/" +
          row.id +
          "/" +
          1,
        headers: {
          authorization: this.tokenValue
        }
      }).then(res => {
        //获取表格数据，默认第一页 10条
        if (res.data && res.data.code === 0) {
          this.$message.success("停用组织机构成功！");
          this.getlist({ limit: 10, page: 1 }); //刷新表格数据
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //表格点击事件
    cellClick(row, column, event, cell) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/tree/" + 1, {
          //row.id
          params: { type: "0" },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            //删除hasChildren属性
            let tableList = res.data.data;
            tableList.forEach(item => {
              this.deleteHasChildren(item);
            });
            //添加获取的数据
            let tableDataCopy = this.tableData.slice(0);
            for (let i = 0; i < tableDataCopy.length; i++) {
              if (tableDataCopy[i].id === row.id) {
                tableDataCopy[i].children = tableList;
              }
            }
            this.tableData = tableDataCopy;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //删除hasChildren属性
    deleteHasChildren(item) {
      if (item.hasChildren) {
        delete item.hasChildren;
        item.children.forEach(item => {
          if (item.hasChildren) {
            delete item.hasChildren;
            this.deleteHasChildren(item);
          }
        });
      }
    },
    //新增组织成功刷新表格
    refreshTable(val) {
      this.getlist(val);
    },
    //获取树形结构节点id
    getNodeId(val) {
      debugger;
      this.nodeClickId = val;
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>

<style scoped>
.organization-main {
  padding: 0;
  padding-top: 5px;
}
.organization-header {
  min-width: 630px;
  height: 40px !important;
  padding: 0;
}

.fr {
  float: right;
}
</style>
