<template>
  <el-container id="create-user">
    <el-header
      style="font-size:20px; border-bottom: 1px solid #ccc;height: 30px;"
    >
      <i class="el-icon-back"></i>
      <span>新增用户信息</span>
    </el-header>
    <el-container>
      <el-header>
        <el-steps
          :active="active"
          finish-status="success"
          simple
          style="margin-top: 20px"
        >
          <el-step title="步骤 1"></el-step>
          <el-step title="步骤 2"></el-step>
          <el-step title="步骤 3"></el-step>
        </el-steps>
      </el-header>
      <el-main>
        <div v-if="dialogId === 1" style="height:400px; overflow:auto;">
          <keep-alive>
            <UserInfo @sendUserInfo="getUserInfo"></UserInfo>
          </keep-alive>
        </div>
        <div v-if="dialogId === 2">
          <keep-alive>
            <SetRole @last="last" @sendSetRole="getSetRole"></SetRole>
          </keep-alive>
        </div>
        <div v-if="dialogId === 3">
          <div>
            <template>
              <el-row style="margin-bottom:5px;">用户信息</el-row>
              <el-table :data="UserInfoData" style="width: 100%" border>
                <el-table-column prop="id" label="用户ID"> </el-table-column>
                <el-table-column prop="username" label="用户名称">
                </el-table-column>
                <el-table-column prop="type" label="用户类型">
                  <template slot-scope="scope">
                    <span v-if="scope.row.type === '0'">普通用户</span>
                    <span v-if="scope.row.type === '8'">管理员</span>
                    <span v-if="scope.row.type === '9'">系统管理员</span>
                    <span v-if="scope.row.type === '1'">第三方测试人员</span>
                  </template>
                </el-table-column>
                <el-table-column prop="organizationName" label="所属科室">
                </el-table-column>
              </el-table>
            </template>
            <div style="height:30px;"></div>
            <template>
              <el-row style="margin-bottom:5px;">角色权限</el-row>
              <el-table
                :data="UserLimitsData"
                style="width: 100%;overflow:auto;"
                border
                height="230px"
              >
                <el-table-column prop="code" label="角色ID"> </el-table-column>
                <el-table-column prop="name" label="角色名称">
                </el-table-column>
                <el-table-column prop="remark" label="角色描述">
                </el-table-column>
              </el-table>
            </template>
          </div>
          <div style="margin-top:10px;">
            <el-button @click="last()" size="mini">
              上一步
            </el-button>
            <el-button type="primary" @click="submitForm()" size="mini">
              完成
            </el-button>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";
import UserInfo from "@/view/modules/module-component/pum/UserInfo";
import SetRole from "@/view/modules/module-component/pum/SetRole";
export default {
  name: "CreateUser",
  components: { UserInfo, SetRole },
  data() {
    return {
      active: 0, //步骤条
      dialogId: 1, //弹窗内默认显示内容
      UserInfoData: [], //用户信息
      UserLimitsData: [], //角色权限
      userInfo: {}, //用户信息传参
      roleIds: [] //角色信息传参
    };
  },
  methods: {
    //步骤条事件:下一步
    next() {
      if (this.active++ > 2) {
        this.active = 2;
        this.dialogId = 3;
      } else {
        this.dialogId++;
      }
    },
    //步骤条事件:上一步
    last() {
      if (this.active-- < 0) {
        this.active = 1;
        this.dialogId = 1;
      } else {
        this.dialogId--;
      }
    },
    //提交表单
    submitForm() {
      this.userInfo.roleIds = this.roleIds;
      this.axios({
        method: "post",
        url: "http://192.168.0.40:9900/uc/sys/user/create",
        data: this.userInfo,
        headers: {
          authorization: this.tokenValue,
          "Content-Type": "application/json"
        }
      }).then(res => {
        if (res.data && res.data.code === 0) {
          this.options = res.data.data;
          this.$emit("close", "关闭弹窗");
          this.$message.success("新增用户成功！");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取用户信息
    getUserInfo(val) {
      this.UserInfoData.push(val);
      let updateData = this.qs.parse({
        appIds: val.appIds,
        disableFlag: val.disableFlag,
        id: val.id,
        organizationId: val.organizationId,
        remark: val.remark,
        type: val.type,
        realName: val.realName,
        username: val.username
      });
      this.userInfo = updateData;
      this.next();
    },
    //获取角色权限
    getSetRole(val) {
      this.UserLimitsData = val;
      //获取角色id
      let data = val.slice(0);
      let roleId = [];
      data.forEach(item => {
        roleId.push(item.id);
      });
      this.roleIds = roleId;
      this.next();
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
</style>
