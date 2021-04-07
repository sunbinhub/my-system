<template>
  <div style="">
    <div
      v-if="userRoleId"
      style="height:30px;background:#ccc;line-height:29px;margin-bottom:20px;padding-left:10px;"
    >
      <span>
        设置角色
      </span>
    </div>
    <div v-else>
      <span style="display: block;margin-bottom: 10px;font-weight: bold;">
        选择角色
      </span>
    </div>
    <template>
      <div style="padding-left: 10px;">
        <el-col :span="11" style="border:1px solid #ccc;">
          <el-row
            style="height: 40px; line-height:39px; background:#ddd; padding: 0 5px;"
          >
            <span>
              已选平台角色
            </span>
          </el-row>
          <el-table
            :data="selectedData"
            ref="selection"
            @selection-change="checkLeftAll"
            style="width: 100 %;overflow:auto;"
            height="320px"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="code" label="角色ID" width="100">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="100">
            </el-table-column>
            <el-table-column prop="remark" label="角色描述" width="200">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="2">
          <div class="opSetting">
            <div @click="handleRemoveSelect">
              <el-button
                icon="el-icon-d-arrow-right"
                :disabled="selectLeftData.length ? false : true"
                size="large"
                type="primary"
              >
              </el-button>
            </div>
            <div class="spacing" @click="handelSelect">
              <el-button
                icon="el-icon-d-arrow-left"
                :disabled="selectRightData.length ? false : true"
                size="large"
                type="primary"
              >
              </el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="10" style="border:1px solid #ccc;">
          <el-row
            style="height: 40px; line-height:39px; background:#ddd; padding: 0 5px;"
          >
            <span>
              待选平台角色列表
            </span>
            <SearchInput
              @searchValue="searchPlatformUser"
              placeholder="请输入角色ID或名称"
              class="fr"
            ></SearchInput>
          </el-row>
          <el-table
            :data="roleData"
            ref="selection"
            @selection-change="checkRightData"
            style="width: 100%; overflow:auto;"
            height="320px"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="code" label="角色ID" width="100">
            </el-table-column>
            <el-table-column prop="name" label="角色名称" width="100">
            </el-table-column>
            <el-table-column prop="remark" label="角色描述" width="200">
            </el-table-column>
          </el-table>
        </el-col>
      </div>
      <div v-if="userRoleId" style="float:right;margin-right:40px;">
        <el-button style="margin-top: 12px;" @click="close" size="mini">
          取消
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 12px;"
          @click="next()"
          size="mini"
        >
          保存
        </el-button>
      </div>
      <div v-else style="padding-left: 10px;">
        <el-button style="margin-top: 12px;" @click="last()" size="mini">
          上一步
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 12px;"
          @click="next()"
          size="mini"
        >
          下一步
        </el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SearchInput from "@/components/common-components/SearchInput";
export default {
  name: "SetRole",
  components: { SearchInput },
  props: {
    userRoleId: {
      type: String
    }
  },
  data() {
    return {
      selectedData: [], // 左边表格数据
      selectLeftData: [], //左边表格选中
      roleData: [], //右侧表格数据
      selectRightData: [] //右侧表格选中
    };
  },
  created() {
    if (this.userRoleId) {
      this.getSelectedData(this.userRoleId);
    } else {
      this.getRoleList({ limit: -1, page: 1 });
    }
  },
  methods: {
    //获取左边表格数据
    getSelectedData(val) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/user/role/" + val, {
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.selectedData = res.data.data;
            this.getRoleList({ limit: -1, page: 1 });
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    //获取右侧表格数据
    getRoleList(data) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/role/page", {
          params: data,
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            if (this.userRoleId) {
              let resData = res.data.data.list.slice(0); //所有的用户
              let dataLength = this.selectedData.length; //已有的用户
              //去除角色下已有用户的数据
              for (let i = resData.length - 1; i >= 0; i--) {
                for (let j = 0; j < dataLength; j++) {
                  if (resData[i].id === this.selectedData[j].id) {
                    resData.splice(i, 1); //splice删除数组中的一项
                  }
                }
              }
              this.roleData = resData;
            } else {
              this.roleData = res.data.data.list;
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    checkRightData(val) {
      this.selectRightData = val; //右侧表格选中
    },
    //
    checkLeftAll(val) {
      this.selectLeftData = val; //左边全选
    },
    //搜索弹窗内平台用户
    searchPlatformUser(value) {
      this.getRoleList({ condition: value, limit: -1, page: 1 });
    },
    // 选中: 右边=>左边
    handelSelect() {
      this.selectedData = this.handleConcatArr(
        this.selectedData,
        this.selectRightData
      );
      this.handleRemoveTabList(this.selectRightData, this.roleData);
      this.selectRightData = [];
    },
    // 取消：左边=>右边
    handleRemoveSelect() {
      this.roleData = this.handleConcatArr(this.roleData, this.selectLeftData);
      this.handleRemoveTabList(this.selectLeftData, this.selectedData);
      this.selectLeftData = [];
    },
    handleConcatArr(selectedData, selectRightData) {
      let arr = [];
      arr = arr.concat(selectedData, selectRightData);
      return arr;
    },
    handleRemoveTabList(isNeedArr, originalArr) {
      if (isNeedArr.length && originalArr.length) {
        for (let i = 0; i < isNeedArr.length; i++) {
          for (let k = 0; k < originalArr.length; k++) {
            if (isNeedArr[i]["name"] === originalArr[k]["name"]) {
              originalArr.splice(k, 1);
            }
          }
        }
      }
    },
    //步骤条事件:上一步
    last() {
      this.$emit("last", "上一步");
    },
    //步骤条事件:下一步
    next() {
      if (this.userRoleId) {
        let data = this.selectedData.slice(0);
        let roleId = [];
        data.forEach(item => {
          roleId.push(item.id);
        });
        let postParams = {
          roleIds: roleId,
          userIds: [this.userRoleId]
        };
        debugger;
        this.axios({
          method: "post",
          url: "http://192.168.0.40:9900/uc/sys/role/user/setting",
          data: postParams,
          headers: {
            authorization: this.tokenValue,
            "Content-Type": "application/json"
          }
        }).then(res => {
          debugger;
          if (res.data && res.data.code === 0) {
            this.$emit("closeDialog", "关闭");
            this.$message.success("设置角色成功！");
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$emit("sendSetRole", this.selectedData);
      }
    },
    //取消
    close() {
      this.$emit("closeDialog", "关闭");
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
.aa {
  position: absolute;
  margin-bottom: 30px;
}
</style>
