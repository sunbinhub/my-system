<template>
  <el-container id="platform-user">
    <!-- 头部开始 -->
    <el-header
      style="border-bottom: 1px solid #ddd; padding:0; height:40px; line-height:40px;margin-bottom: 10px;"
    >
      <span>用户管理</span>
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
          :dataTree="dataTree"
          @nodeClick="getNodeId"
          @dateTree="getDataTree"
        ></AsideTree>
      </el-aside>
      <!-- 左侧树形结构结束 -->
      <!-- 右侧主体开始 -->
      <el-main class="organization-main">
        <el-container>
          <!-- 右侧头部开始 -->
          <el-header style="height:30px;">
            <el-row>
              <el-col :span="21">
                <el-select
                  v-model="organizationStatus"
                  placeholder="用户类型"
                  size="mini"
                >
                  <el-option label="普通用户" value="0"></el-option>
                  <el-option label="第三方测试人员" value="1"></el-option>
                  <el-option label="管理员" value="8"></el-option>
                  <el-option label="系统管理员" value="9"></el-option>
                </el-select>
                <SearchInput
                  @searchValue="searchOrganization"
                  placeholder="请输入用户名/ID"
                ></SearchInput>
              </el-col>
              <el-col :span="3">
                <el-button
                  type="primary"
                  @click="dialogFormVisible = true"
                  size="mini"
                >
                  新建用户
                </el-button>
              </el-col>
            </el-row>
          </el-header>
          <!-- 右侧头部结束 -->
          <!-- 右侧表格开始 -->
          <el-main style="padding:0;">
            <template>
              <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                :height="tableHeight"
              >
                <el-table-column
                  type="index"
                  label="序号"
                  align="center"
                  width="100"
                  sortable
                ></el-table-column>
                <el-table-column prop="id" label="用户ID" width="120">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="120">
                </el-table-column>
                <el-table-column
                  prop="departmentName"
                  label="所属科室"
                  width="120"
                >
                </el-table-column>
                <el-table-column prop="name" label="所属角色" width="120">
                </el-table-column>
                <el-table-column prop="type" label="用户类型" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === 0">普通用户</span>
                    <span v-if="scope.row.type === 1">第三方测试人员</span>
                    <span v-if="scope.row.type === 8">管理员</span>
                    <span v-if="scope.row.type === 9">系统管理员</span>
                  </template>
                </el-table-column>
                <el-table-column prop="disableFlag" label="状态" width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.disableFlag === 0">在用</span>
                    <span v-if="scope.row.disableFlag === 1">停用</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="260">
                  <template slot-scope="scope">
                    <el-button
                      @click="changeInfo(scope.row)"
                      type="text"
                      size="small"
                    >
                      修改信息
                    </el-button>
                    <el-button
                      @click="disabledUser(scope.row)"
                      type="text"
                      size="small"
                    >
                      停用用户
                    </el-button>
                    <el-button
                      @click="setRole(scope.row)"
                      type="text"
                      size="small"
                    >
                      设置角色
                    </el-button>
                    <el-dropdown size="small">
                      <span
                        class="el-dropdown-link"
                        style="font-size:10px;color:#409EFF;cursor: pointer;"
                      >
                        更多操作
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          @click.native="restoreOriginalPassword(scope.row)"
                          style="color:#409EFF;"
                        >
                          恢复原始密码
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click.native="unlockUser(scope.row)"
                          style="color:#409EFF;"
                        >
                          解锁用户
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click.native="removeUser(scope.row)"
                          style="color:#409EFF;"
                        >
                          删除用户
                        </el-dropdown-item>
                        <el-dropdown-item
                          @click.native="applicationCategory(scope.row)"
                          style="color:#409EFF;"
                        >
                          应用范畴
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
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
              <el-dialog
                :visible.sync="dialogFormEvent"
                style="width:1300px;"
                :show-close="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
              >
                <div v-if="eventId === 1">
                  <UserInfo
                    :userInfoData="userInfoData"
                    @closeDialog="dialogFormEvent = false"
                  ></UserInfo>
                </div>
                <div v-if="eventId === 2">
                  <SetRole
                    :userRoleId="userIdDialog"
                    @closeDialog="dialogFormEvent = false"
                  ></SetRole>
                </div>
              </el-dialog>
            </template>
          </el-main>
          <!-- 右侧表格结束 -->
          <!-- 弹窗开始 -->
          <el-dialog
            :visible.sync="dialogFormVisible"
            style="width:1300px;"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
          >
            <CreateUser @close="dialogFormVisible = false"></CreateUser>
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
import CreateUser from "@/view/modules/module-component/pum/CreateUser";
import UserInfo from "@/view/modules/module-component/pum/UserInfo";
import SetRole from "@/view/modules/module-component/pum/SetRole";

export default {
  components: {
    SearchInput,
    Pagination,
    AsideTree,
    CreateUser,
    UserInfo,
    SetRole
  },
  data() {
    return {
      //树形结构数据
      dataTree: [],
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
      nodeClickId: 0, //机构id
      dialogFormEvent: false, //表格事件弹窗
      eventId: "", //表格事件弹窗id
      userInfoData: {}, //用户信息数据
      userIdDialog: "" //角色id
    };
  }, // 生命周期 - 创建完成（可以访问当前this实例）
  created() {
    window.addEventListener("resize", this.getPlatformAsideHeight); // 注册监听器
    this.getPlatformAsideHeight(); // 页面创建时先调用一次

    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
  },
  watch: {
    //树形结构搜索方法
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getPlatformAsideHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.platformAsideHeight.height = window.innerHeight - 172 + "px";
    },
    getTableHeight() {
      // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
      this.tableHeight = window.innerHeight - 256 + "px";
    },
    //获取树型结构
    getDataTree() {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/tree/" + 0, {
          params: { type: "0" },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          //获取表格数据，默认第一页 10条
          if (res.data && res.data.code === 0) {
            this.dataTree = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //设置表格数据
    getlist(data) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/user/page", {
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
    //获取树形结构节点id
    getNodeId(val) {
      this.nodeClickId = val;
      let data = {
        organizationId: val,
        limit: 10,
        page: 1
      };
      this.getlist(data);
    },
    //搜索组件
    searchOrganization(val) {
      let data = {
        type: this.organizationStatus, //组织状态
        condition: val, //搜索值
        organizationId: this.nodeClickId, //机构id
        limit: 10,
        page: 1
      };
      this.getlist(data);
    },
    //表格-修改信息
    changeInfo(row) {
      row.type = row.type.toString();
      this.userInfoData = row;
      this.dialogFormEvent = true;
      this.eventId = 1;
    },
    //表格-停用用户
    disabledUser(row) {
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/user/switch/" + row.id + "/" + 1,
        headers: {
          authorization: this.tokenValue
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success("停用用户成功！");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //表格-设置角色
    setRole(row) {
      // row.type = row.type.toString();
      this.userIdDialog = row.id;
      this.dialogFormEvent = true;
      this.eventId = 2;
    },
    //表格-恢复原始密码
    restoreOriginalPassword(row) {
      let updateData = this.qs.stringify({
        username: row.username
      });
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/user/password/reset",
        data: updateData,
        headers: {
          authorization: this.tokenValue
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success("恢复原始密码成功！");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //表格-解锁用户
    unlockUser(row) {
      // let updateData = this.qs.stringify({
      //   username: row.username
      // });
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/user/unlock/" + row.username,
        headers: {
          authorization: this.tokenValue
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success("解锁用户成功！");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //表格-删除用户
    removeUser(row) {
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/user/delete/" + row.id,
        headers: {
          authorization: this.tokenValue
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success("删除用户成功！");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //表格-应用范畴
    applicationCategory() {}
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

<style>
.organization-main {
  padding: 0;
  padding-top: 5px;
}

.fr {
  float: right;
}
#platform-user .el-dialog {
  margin: 0 auto;
  margin-top: 5px !important;
  width: 70%;
  height: 600px;
}
#platform-user .el-dialog__body {
  padding: 0;
}
#platform-user .el-dialog__header {
  padding: 0;
}

.opSetting {
  text-align: center;
  margin-top: 120px;
}
.spacing {
  margin-top: 10px;
}
</style>
