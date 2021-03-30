<template>
  <el-dialog title="修改密码" :visible.sync="visible" :append-to-body="true">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import clearLoginInfo from "@/router/logOff";
import { mapGetters } from "vuex";
export default {
  name: "UpdatePassword",
  data() {
    let validateConfirmPassword = (rule, value, callback) => {
      if (this.dataForm.newPassword !== value) {
        callback(new Error("确认密码与新密码不一致"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      dataForm: {
        password: "",
        newPassword: "",
        confirmPassword: ""
      },
      dataRule: {
        password: [
          { required: true, message: "原密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validateConfirmPassword, trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    userName: {
      get() {
        return this.$store.state.userInfo.username;
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.mainTabs;
      },
      set(val) {
        this.$store.commit("updateMainTabs", val);
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          //报错：JSON parse error: Unrecognized token 'newPassword'
          //解决：this.qs.parse(data)将URL解析成对象的形式
          //另外一种形式：this.qs.stringify(data)将对象序列化成URL的形式，以&进行拼接
          let updateData = this.qs.parse({
            newPassword: this.dataForm.newPassword,
            password: this.dataForm.password
          });
          this.axios({
            method: "post",
            url: "http://192.168.0.40:9900/uc/sys/user/password/update",
            data: updateData,
            headers: {
              authorization: this.tokenValue,
              "Content-Type": "application/json"
            }
          }).then(res => {
            if (res.data && res.data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  this.$nextTick(() => {
                    this.mainTabs = [];
                    clearLoginInfo();
                    this.$router.replace({ name: "login" });
                  });
                }
              });
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>
