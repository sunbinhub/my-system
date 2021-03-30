<template>
  <el-container id="add-user-header">
    <el-header style="height:60px;line-height:60px;">
      <span>已添加用户列表</span>
    </el-header>
    <el-container>
      <el-header style="height:40px;line-height:40px;">
        <el-row>
          <el-col :span="18">
            <div class="block" style="float:left;">
              <el-cascader
                :props="propsLeft"
                :options="optionsLeft"
                @change="handleChangeLeft"
                placeholder="科室 / 病区"
                size="mini"
              >
              </el-cascader>
            </div>
            <div class="block" style="float:left;margin-left:5px;">
              <el-cascader
                :props="propsRight"
                :options="optionsRight"
                @change="handleChangeRight"
                placeholder="科室 / 病区"
                size="mini"
              >
              </el-cascader>
            </div>
            <div style="float:left;margin-left:5px;">
              <SearchInput
                @searchValue="searchUsers"
                placeholder="请输入用户名/ID"
              ></SearchInput>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-button size="mini" @click="dialogVisible = true">
                添加
              </el-button>
              <el-button size="mini" @click="deleteUser">删除</el-button>
            </div>
          </el-col>
        </el-row>
        <el-dialog
          :visible.sync="dialogVisible"
          :modal-append-to-body="true"
          append-to-body
          width="79%"
          top="2vh"
        >
          <AddUserDialog
            :userIds="userIds"
            :roleId="roleId"
            @close="dialogVisible = false"
            @addUsers="addTableData"
          ></AddUserDialog>
        </el-dialog>
      </el-header>
      <el-main>
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            height="300px"
            border
          >
            <el-table-column type="selection"> </el-table-column>
            <el-table-column prop="id" label="用户ID" width="120">
            </el-table-column>
            <el-table-column prop="realName" label="用户名称"></el-table-column>
            <el-table-column prop="type" label="用户类型"></el-table-column>
            <el-table-column
              prop="departmentName"
              label="所属科室"
            ></el-table-column>
          </el-table>
        </template>
        <Pagination
          :totalCount="totalCount"
          @paginationChange="getlist"
        ></Pagination>
      </el-main>
    </el-container>
    <el-footer>
      <div style="float:right;">
        <el-button size="mini" @click="cancel">取消</el-button>
        <el-button size="mini" @click="save" type="primary">保存</el-button>
      </div>
    </el-footer>
  </el-container>
</template>
<script>
import { mapGetters } from "vuex";
import SearchInput from "@/components/common-components/SearchInput";
import Pagination from "@/components/common-components/Pagination";
import AddUserDialog from "@/view/modules/module-component/prm/AddUserDialog";
export default {
  name: "AddUser",
  components: { SearchInput, Pagination, mapGetters, AddUserDialog },
  props: {
    roleId: ""
  },
  data() {
    return {
      optionsLeft: [],
      propsLeft: {
        value: "id",
        label: "fullName"
      },
      optionsRight: [],
      propsRight: {
        value: "id",
        label: "fullName"
      },
      cascaderVal: null, //选择器改变的值
      tableData: [],
      multipleSelection: [], //表格选中的数据
      totalCount: null, //用户数据总条数
      dialogVisible: false, //添加用户弹窗
      userIds: [] //角色下的用户ids
    };
  },
  //组件创建后
  created() {
    //获取科室数据
    this.getDepartment(this.roleId);
    //获取用户数据
    this.getTableData({ roleId: this.roleId });
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  },
  watch: {
    roleId(val) {
      //获取科室数据
      this.getDepartment(val);
      //获取用户数据
      this.getTableData({ roleId: val });
    }
  },
  methods: {
    //获取科室数据
    getDepartment(val) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/page/" + val, {
          // 11有数据
          params: {
            limit: 99999,
            page: 1
          },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.optionsLeft = res.data.data.list; //科室/病区数据
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //左边选择器点击事件
    handleChangeLeft(val) {
      //调接口 获取病区
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/list/" + val, {
          params: {
            limit: 99999,
            page: 1
          },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.optionsRight = res.data.data; //科室/病区数据
          } else {
            this.$message.error(res.data.msg);
          }
        });
      this.cascaderVal = val[0];
    },
    //右边选择器点击事件
    handleChangeRight(val) {
      this.cascaderVal = val[0];
    },
    //搜索用户
    searchUsers(val) {
      this.getTableData({ roleId: this.cascaderVal, condition: val });
    },
    //删除用户
    deleteUser() {
      let selections = this.multipleSelection; //选中的数据
      let selectionsLength = selections.length; //选中数据长度
      let delData = this.tableData.slice(0); //原来的表格数据 - slice截取数组中的一项(深拷贝)
      //删除用户
      for (let i = delData.length - 1; i >= 0; i--) {
        for (let j = 0; j < selectionsLength; j++) {
          if (delData[i].id === selections[j].id) {
            delData.splice(i, 1); //splice删除数组中的一项
          }
        }
      }
      this.tableData = delData; //删除后的数据
    },
    //表格选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //获取用户数据
    getTableData(val) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/user/page", {
          params: val,
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.tableData = res.data.data.list; //科室/病区数据
            this.totalCount = res.data.data.totalCount;
            this.getUserIds(res.data.data.list);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //分页传递的参数
    getlist(val) {
      //获取表格数据
      this.getTableData({
        roleId: this.cascaderVal,
        limit: val.limit,
        page: val.page
      });
    },
    //取消：关闭弹窗
    cancel() {
      this.$emit("close", "关闭弹窗");
    },
    //保存用户数据
    save() {
      let userId = []; //表格内用户id
      this.tableData.forEach(item => {
        userId.push(item.id);
      });
      //调接口
      let postParams = this.qs.parse({
        roleIds: [this.roleId],
        userIds: userId
      });
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/role/user/setting",
        data: postParams,
        headers: {
          authorization: this.tokenValue,
          "Content-Type": "application/json"
        }
      }).then(res => {
        //获取表格数据，默认第一页 10条
        if (res.data && res.data.code === 0) {
          this.$message.success("保存成功！");
          this.dialogFormVisible = false; //关闭弹窗
          this.getlist({ limit: 10, page: 1 }); //刷新表格数据
        } else {
          this.$message.error(res.data.msg + "!");
        }
      });
    },
    //获取用户ids
    getUserIds(data) {
      data.forEach(element => {
        this.userIds.push(element.id);
      });
    },
    //拿到添加的用户数据
    addTableData(val) {
      val.forEach(item => {
        this.tableData.push(item);
      });
    }
  }
};
</script>

<style></style>
