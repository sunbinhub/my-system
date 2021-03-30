<template>
  <el-container>
    <el-header
      style="height:50px;background:#ccc;line-height:50px;margin-bottom:20px;"
      v-if="platformRoleForm.id"
    >
      修改角色信息
    </el-header>
    <el-main>
      <el-form
        :model="platformRoleForm"
        :rules="platformRoleFormRules"
        ref="platformRoleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色代码" prop="code" size="mini">
          <el-input
            v-model="platformRoleForm.code"
            size="mini"
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="platformRoleForm.name"
            size="mini"
            style="width:200px;"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" size="mini">
          <el-input
            type="textarea"
            :rows="3"
            v-model="platformRoleForm.remark"
            resize="none"
            style="width:200px;"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="状态" prop="disableFlag" size="mini">
          <el-radio-group v-model="platformRoleForm.disableFlag">
            <el-radio :label="0">在用</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!platformRoleForm.id">
          <el-button
            type="primary"
            @click="submit('platformRoleForm')"
            style="margin-top:70px;"
          >
            下一步
          </el-button>
        </el-form-item>
        <el-form-item v-if="platformRoleForm.id">
          <el-button @click="handleActive()">
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submit('platformRoleForm')"
          >
            保存
          </el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "RoleInfo",
  props: {
    platformRoleForm: {
      type: Object,
      default: () => ({
        id: "", //角色id
        code: "", //角色代码
        name: "", //角色名称
        disableFlag: 0, //状态
        remark: "" //角色描述
      })
    }
  },
  data() {
    return {
      platformRoleFormRules: {
        code: [{ required: true, message: "请输入角色代码", trigger: "blur" }],
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
        disableFlag: [
          { required: true, message: "请选择状态", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.platformRoleForm.id) {
            this.$emit("changeRoleInfo", this.platformRoleForm);
          } else {
            this.$emit("submitRoleinfo", this.platformRoleForm);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleActive() {
      this.$emit("closeTableDialog", "关闭");
    }
  }
};
</script>

<style></style>
