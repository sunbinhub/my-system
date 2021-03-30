<template>
  <el-container id="add-user-dialog">
    <el-header>
      <span>用户信息</span>
    </el-header>
    <el-container>
      <el-header style="height:40px;line-height:40px;">
        <el-row>
          <el-col :span="24">
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
        </el-row>
      </el-header>
      <el-main>
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
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
      <el-row>
        <el-col :span="8">&nbsp;</el-col>
        <el-col :span="6">
          <el-button size="mini" @click="cancel">取消</el-button>
          <el-button size="mini" @click="add" type="primary">添加</el-button>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import SearchInput from "@/components/common-components/SearchInput";
import Pagination from "@/components/common-components/Pagination";
import AddUserDialog from "@/view/modules/module-component/prm/AddUserDialog";
export default {
  name: "AddUserDialog",
  components: { SearchInput, Pagination, mapGetters, AddUserDialog },
  props: {
    userIds: {
      type: Array
    },
    roleId: {
      type: String
    }
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
      totalCount: null //用户数据总条数
    };
  },
  //组件创建后
  created() {
    //获取科室数据
    this.getDepartment(this.roleId);
    //获取用户数据
    this.getTableData();
  },
  watch: {
    userIds() {
      //获取科室数据
      this.getDepartment(this.roleId);
      //获取用户数据
      this.getTableData();
    }
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  },
  methods: {
    //获取用户数据
    getTableData(val) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/user/page", {
          params: val,
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            let resData = res.data.data.list.slice(0); //所有的用户 - slice截取数组中的一项(深拷贝)
            let userIdsLehgtn = this.userIds.length; //已有的用户
            //去除角色下已有用户的数据
            for (let i = resData.length - 1; i >= 0; i--) {
              for (let j = 0; j < userIdsLehgtn; j++) {
                if (resData[i].id === this.userIds[j]) {
                  resData.splice(i, 1); //splice删除数组中的一项
                }
              }
            }
            this.tableData = resData;
            this.totalCount = res.data.data.totalCount - this.userIds.length; //所有用户数量 - 角色下已有用户数量
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //获取科室数据
    getDepartment(val) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/page/" + val, {
          //11有数据
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
    //取消
    cancel() {
      this.$emit("close", "关闭弹窗");
    },
    //添加
    add() {
      //添加的用户信息传递给父组件
      this.$emit("addUsers", this.multipleSelection);
      this.cancel();
    },
    //表格选择事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //分页传递的参数
    getlist(val) {
      //获取表格数据
      this.getTableData({
        limit: val.limit,
        page: val.page
      });
    }
  }
};
</script>

<style></style>
