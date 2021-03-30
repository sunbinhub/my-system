<template>
  <el-container id="platform-role">
    <!-- 头部开始 -->
    <el-header
      style="border-bottom: 1px solid #ddd; padding:0; height:40px; line-height:40px;margin-bottom: 10px;"
    >
      <span>角色管理</span>
    </el-header>
    <!-- 头部结束 -->
    <el-container>
      <el-header style="pading: 0; padding-right: 10px;">
        <el-row>
          <el-button
            type="primary"
            size="mini"
            class="fl"
            @click="dialogFormVisible = true"
          >
            新建角色
          </el-button>
          <SearchInput
            @searchValue="searchPlatformRole"
            placeholder="请输入角色名称/ID"
            class="fr"
          ></SearchInput>
        </el-row>
      </el-header>
      <el-main style="padding:0;">
        <el-table
          :data="tableData"
          style="width: 100%, overflow: auto;"
          :height="tableHeight"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            sortable
            width="100"
          ></el-table-column>
          <el-table-column prop="code" label="角色代码" width="150">
          </el-table-column>
          <el-table-column prop="name" label="角色名称" width="120">
          </el-table-column>
          <el-table-column prop="remark" label="角色描述" width="120">
          </el-table-column>
          <el-table-column prop="disableFlag" label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.disableFlag === 0">在用</span>
              <span v-if="scope.row.disableFlag === 1">停用</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="260">
            <template slot-scope="scope">
              <el-button
                @click="CheckRoleClick(scope.row)"
                type="text"
                size="small"
              >
                查看角色
              </el-button>
              <el-button
                @click="changeInformationClick(scope.row)"
                type="text"
                size="small"
              >
                修改信息
              </el-button>
              <el-button
                @click="addUserClick(scope.row)"
                type="text"
                size="small"
              >
                添加用户
              </el-button>
              <el-dropdown size="small">
                <span class="el-dropdown-link">
                  更多
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    @click.native="setRoleLimitsClick(scope.row)"
                  >
                    设置角色权限
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click.native="setRoleTacticsClick(scope.row)"
                    >设置角色策略</el-dropdown-item
                  >
                  <el-dropdown-item @click.native="removeRoleClick(scope.row)"
                    >删除角色</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :totalCount="totalCount" @paginationChange="getlist">
        </Pagination>
        <el-dialog
          :visible.sync="dialogVisible"
          :modal-append-to-body="false"
          width="80%"
          top="1vh"
        >
          <div v-if="tableDialog === 1">
            <ShowRole
              :roleInfo="roleInfo"
              @closeTableDialog="dialogVisible = false"
            ></ShowRole>
          </div>
          <div v-if="tableDialog === 2">
            <RoleInfo
              :platformRoleForm="setRoleInfo"
              @closeTableDialog="dialogVisible = false"
              @changeRoleInfo="sendRoleInfo"
            ></RoleInfo>
          </div>
          <div v-if="tableDialog === 3">
            <AddUser
              :roleId="getRoleId"
              @close="dialogVisible = false"
            ></AddUser>
          </div>
          <div v-if="tableDialog === 4">
            <TacticsSearchTable
              :roleId="currentId"
              @closeTableDialog="dialogVisible = false"
              @saveMenuTree="sendMenuTree"
            ></TacticsSearchTable>
          </div>
        </el-dialog>
      </el-main>
      <!-- 弹窗开始 -->
      <el-dialog :visible.sync="dialogFormVisible" width="80%" top="1vh">
        <el-container>
          <el-header
            style="font-size:20px; border-bottom: 1px solid #ccc;height: 40px;padding:5px 0 0 10px;"
          >
            <i
              class="el-icon-back"
              @click="dialogFormVisible = false"
              style="cursor:pointer;margin-right:5px;"
            >
            </i>
            <span>角色信息</span>
          </el-header>
          <el-container>
            <el-header>
              <el-steps
                :active="active"
                finish-status="success"
                simple
                style="margin-top: 20px"
              >
                <el-step title="填写角色信息"></el-step>
                <el-step title="设置角色权限"></el-step>
                <el-step title="审阅信息和权限"></el-step>
              </el-steps>
            </el-header>
            <el-main>
              <div
                v-if="dialogId === 1 ? true : false"
                style="height:412px; overflow:auto;"
              >
                <keep-alive>
                  <RoleInfo @submitRoleinfo="getRoleinfo"></RoleInfo>
                </keep-alive>
              </div>
              <div
                v-if="dialogId === 2 ? true : false"
                style="height:400px; overflow:auto;"
              >
                <keep-alive>
                  <TacticsSearchTable
                    @setMenuTree="getMenuTree"
                    @setLast="last"
                  ></TacticsSearchTable>
                </keep-alive>
              </div>
              <div
                v-if="dialogId === 3 ? true : false"
                style="height:400px; overflow:auto;"
              >
                <keep-alive>
                  <CheckInfoAndTactics
                    :useMenuTree="newMenuTree"
                    @setLast="last"
                    @newRole="submitNewRole"
                  ></CheckInfoAndTactics>
                </keep-alive>
              </div>
            </el-main>
          </el-container>
        </el-container>
      </el-dialog>
      <!-- 弹窗结束 -->
    </el-container>
  </el-container>
</template>

<script>
import SearchInput from "@/components/common-components/SearchInput";
import TacticsSearchTable from "@/view/modules/module-component/prm/TacticsSearchTable";
import Pagination from "@/components/common-components/Pagination";
import RoleInfo from "@/view/modules/module-component/prm/RoleInfo";
import CheckInfoAndTactics from "@/view/modules/module-component/prm/CheckInfoAndTactics";
import ShowRole from "@/view/modules/module-component/prm/ShowRole";
import AddUser from "@/view/modules/module-component/prm/AddUser";
import { mapGetters } from "vuex";
export default {
  components: {
    SearchInput,
    TacticsSearchTable,
    Pagination,
    RoleInfo,
    CheckInfoAndTactics,
    ShowRole,
    AddUser
  },
  data() {
    return {
      tableData: [
        {
          //其中的一条数据
          code: "ROLE_ADMIN", //角色code
          createdByName: "", //创建人名称
          createdTime: null, //创建名称
          disableFlag: 0, //0-在用，1-停用
          id: "2", //角色ID
          name: "管理员", //角色名称
          remark: "管理员" //角色描述
        }
      ],
      total: "",
      pageSize: "",
      tableSizeData: {},
      tableHeight: "", //最外层表格高度
      handleOptions: "", //表格操作列

      //弹窗数据
      dialogFormVisible: false, //新建弹窗是否显示
      active: 0, //新建步骤条
      dialogId: 1, //新建弹窗内默认显示内容
      totalCount: null, //总共多少条数据(传给分页组件)
      newRoleInfo: null, //新建角色信息
      newMenuTree: null, //新建角色权限
      roleInfo: [], //角色信息
      dialogVisible: false, //表格内的弹窗
      tableDialog: null, //表格弹窗内默认显示内容
      setRoleInfo: null, //修改用户信息
      currentId: null, //修改角色权限的id
      getRoleId: null //新增用户的角色id
    };
  },
  created() {
    window.addEventListener("resize", this.getTableHeight); // 注册监听器
    this.getTableHeight(); // 页面创建时先调用一次
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  },
  methods: {
    //搜索角色ID
    searchPlatformRole(value) {
      this.getlist({ condition: value, limit: 10, page: 1 });
    },
    // 获取浏览器高度，减去顶部导航栏的值70（可动态获取）
    getTableHeight() {
      this.tableHeight = window.innerHeight - 264 + "px";
    },
    //设置表格数据
    getlist(data) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/role/page", {
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
    //查看角色信息权限
    CheckRoleClick(row) {
      this.roleInfo = [];
      this.roleInfo.push(row);
      this.dialogVisible = true;
      this.tableDialog = 1;
    },
    //修改用户信息
    changeInformationClick(row) {
      this.setRoleInfo = row;
      this.dialogVisible = true;
      this.tableDialog = 2;
    },
    //添加用户
    addUserClick(row) {
      this.getRoleId = row.id;
      this.dialogVisible = true;
      this.tableDialog = 3;
    },
    //修改角色权限
    setRoleLimitsClick(row) {
      this.currentId = row.id;
      this.dialogVisible = true;
      this.tableDialog = 4;
    },
    setRoleTacticsClick(row) {
      console.log(row.name);
    },
    //删除角色
    removeRoleClick(row) {
      this.$confirm(`确定进行[删除角色]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios({
            method: "post",
            url: "http://192.168.0.40:9900/uc/sys/role/delete/" + row.id,
            headers: {
              authorization: this.tokenValue
            }
          }).then(res => {
            //获取表格数据，默认第一页 10条
            if (res.data && res.data.code === 0) {
              this.$message.success("删除角色成功！");
              this.getlist({ limit: 10, page: 1 }); //刷新表格数据
            } else {
              this.$message.error(res.data.msg + "!");
            }
          });
        })
        .catch(() => {});
      console.log(row.id);
    },
    //步骤条事件
    next() {
      if (this.active++ > 2) {
        this.active = 2;
        this.dialogId = 3;
      } else {
        this.dialogId++;
      }
    },
    last() {
      if (this.active-- < 0) {
        this.active = 1;
        this.dialogId = 1;
      } else {
        this.dialogId--;
      }
    },
    //新增角色信息
    getRoleinfo(val) {
      this.newRoleInfo = val;
      this.next();
    },
    //新增角色权限
    getMenuTree(val) {
      this.newMenuTree = val;
      this.next();
    },
    //提交新增角色信息和权限
    submitNewRole() {
      let postParams = this.qs.parse({
        menuIds: this.newMenuTree,
        role: this.newRoleInfo
      });
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/role/create",
        data: postParams,
        headers: {
          authorization: this.tokenValue,
          "Content-Type": "application/json"
        }
      }).then(res => {
        //获取表格数据，默认第一页 10条
        if (res.data && res.data.code === 0) {
          this.$message.success("创建成功！");
          this.dialogFormVisible = false; //关闭弹窗
          this.getlist({ limit: 10, page: 1 }); //刷新表格数据
        } else {
          this.$message.error(res.data.msg + "!");
        }
      });
    },
    //修改角色信息
    sendRoleInfo(val) {
      let postParams = this.qs.parse(val);
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/role/update",
        data: postParams,
        headers: {
          authorization: this.tokenValue,
          "Content-Type": "application/json"
        }
      }).then(res => {
        //获取表格数据，默认第一页 10条
        if (res.data && res.data.code === 0) {
          this.$message.success("修改成功！");
          this.dialogVisible = false; //关闭弹窗
          this.getlist({ limit: 10, page: 1 }); //刷新表格数据
        } else {
          this.$message.error(res.data.msg + "!");
        }
      });
    },
    //修改角色权限
    sendMenuTree(val) {
      let postParams = this.qs.parse({
        menuIds: val
      });
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/role/create",
        data: postParams,
        headers: {
          authorization: this.tokenValue,
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          this.$message.success("创建成功！");
          this.dialogVisible = false; //关闭弹窗
          this.getlist({ limit: 10, page: 1 }); //刷新表格数据
        } else {
          this.$message.error(res.data.msg + "!");
        }
      });
    }
  }
};
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

/* #platform-role .el-dialog {
  margin: 0 auto;
  margin-top: 5px !important;
  width: 70%;
  height: 600px;
} */
#platform-role .el-dialog__body {
  padding: 0;
}

#platform-role .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

#platform-role .el-dialog__header {
  padding: 0;
}

.fl {
  float: left;
}

.fr {
  float: right;
}
</style>
