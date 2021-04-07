<template>
  <div>
    <div
      v-if="userInfoData.id"
      style="height:30px;background:#ccc;line-height:29px;margin-bottom:10px;padding-left:10px;"
    >
      <span>修改平台角色信息</span>
    </div>
    <el-form
      :model="userInfoData"
      :rules="userInfoDataRules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="用户姓名" prop="username">
        <el-input
          v-model="userInfoData.username"
          size="mini"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input
          v-model="userInfoData.realName"
          size="mini"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="type" size="mini">
        <el-select
          v-model="userInfoData.type"
          placeholder="请选择用户类型"
          size="mini"
          @change="getDepartment"
        >
          <el-option label="普通用户" value="0"></el-option>
          <el-option label="管理员" value="8"></el-option>
          <el-option label="系统管理员" value="9"></el-option>
          <el-option label="第三方测试人员" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属科室" prop="organizationId" size="mini">
        <el-select placeholder="请选择" v-model="userInfoData.organizationId">
          <el-option
            :value="userInfoData.organizationId"
            :label="userInfoData.organizationName"
            style="height:150px;overflow:auto;background:#fff;"
          >
            <el-tree
              id="tree-option"
              ref="selectTree"
              :data="options"
              :props="defaultProps"
              :default-expanded-keys="defaultExpandedKey"
              @node-click="handleNodeClick"
            >
            </el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="应用系统"
        prop="appIds"
        size="mini"
        v-if="userInfoData.type === '1'"
      >
        <el-checkbox-group
          v-model="userInfoData.appIds"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="item in checkboxData"
            :label="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" prop="disableFlag" size="mini">
        <el-radio-group v-model="userInfoData.disableFlag">
          <el-radio :label="0">在用</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" size="mini">
        <el-input
          type="remark"
          :rows="3"
          v-model="userInfoData.remark"
          resize="none"
          style="width:200px;"
        >
        </el-input>
      </el-form-item>
      <el-form-item size="mini">
        <div v-if="userInfoData.id">
          <el-button @click="close">
            取消
          </el-button>
          <el-button type="primary" @click="next('ruleForm')">
            保存
          </el-button>
        </div>
        <div v-else>
          <el-button type="primary" @click="next('ruleForm')">
            下一步
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "UserInfo",
  props: {
    userInfoData: {
      type: Object,
      default() {
        return {
          id: "", //用户ID
          realName: "", //真实名称
          type: "", //用户类型
          organizationId: "", //所属科室
          organizationName: "", //所属科室名字
          appIds: [], //应用系统id
          disableFlag: "", //状态
          remark: "", //备注
          username: "" //用户名称
        };
      }
    }
  },
  data() {
    return {
      userInfoDataRules: {
        realName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        type: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ],
        organizationId: [
          {
            required: true,
            message: "请至少选择一个",
            trigger: "change"
          }
        ],
        disableFlag: [
          { required: true, message: "请选择状态", trigger: "change" }
        ],
        appIds: [
          {
            type: "array",
            required: true,
            message: "请选择应用系统",
            trigger: "change"
          }
        ]
      },
      options: [], //树形控件数据
      //默认值
      defaultProps: {
        children: "children",
        label: "name"
      },
      defaultExpandedKey: [], //默认打开
      checkboxData: [] //应用系统数据
    };
  },
  created() {
    if (this.userInfoData.id) {
      this.getDepartment(this.userInfoData.type);
    }
  },
  methods: {
    //步骤条事件:下一步
    next(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.userInfoData.id) {
            let postParams = {
              appIds: this.userInfoData.appIds,
              disableFlag: this.userInfoData.disableFlag,
              id: this.userInfoData.id,
              organizationId: this.userInfoData.organizationId,
              remark: this.userInfoData.remark,
              type: this.userInfoData.type,
              realName: this.userInfoData.realName,
              username: this.userInfoData.username
            };
            debugger;
            this.axios({
              method: "post",
              url: "http://192.168.0.40:9900/uc/sys/user/update",
              data: postParams,
              headers: {
                authorization: this.tokenValue,
                "Content-Type": "application/json"
              }
            }).then(res => {
              if (res.data && res.data.code === 0) {
                this.$emit("closeDialog", "关闭");
                this.$message.success("修改信息成功！");
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            this.$emit("sendUserInfo", this.userInfoData);
          }
        } else {
          return false;
        }
      });
    },
    //用户类型选中事件
    getDepartment(val) {
      this.axios
        .get("http://192.168.0.40:9900/uc/sys/organization/tree/" + val, {
          params: { type: "1" },
          headers: { authorization: this.tokenValue }
        })
        .then(res => {
          if (res.data && res.data.code === 0) {
            this.userInfoData.organizationId = "";
            this.userInfoData.organizationName = "";
            this.options = res.data.data;
          } else {
            this.$message.error(res.data.msg);
          }
        });
      if (val === "1") {
        this.axios
          .get("http://192.168.0.40:9900/uc/sys/app/list/" + val, {
            headers: { authorization: this.tokenValue }
          })
          .then(res => {
            if (res.data && res.data.code === 0) {
              this.checkboxData = res.data.data;
            } else {
              this.$message.error(res.data.msg);
            }
          });
      }
    },
    //树形结构点击事件
    handleNodeClick(row) {
      //给对象新增属性
      this.$set(this.userInfoData, "organizationId", row.id);
      this.$set(this.userInfoData, "organizationName", row.name);
      debugger;
    },
    //多选框改变事件
    handleCheckedCitiesChange(value) {
      this.appIds = value;
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

<style></style>
