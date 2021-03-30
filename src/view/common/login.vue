<template>
  <div class="login">
    <!-- 登录表单 -->
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules"
      ref="loginForm"
      label-width="100px"
      class="demo-loginForm"
    >
      <h1 class="title">
        <i class="el-icon-setting"></i>
        clinbtain登录
      </h1>

      <el-form-item label="账号" prop="userName">
        <el-input
          type="text"
          v-model="loginForm.userName"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="passWord">
        <el-input
          type="password"
          v-model="loginForm.passWord"
          autocomplete="off"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      //登录表单的数据
      loginForm: {
        userName: "",
        passWord: ""
      },
      //验证规则
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur"
          }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 18,
            message: "长度在 5 到 18 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //保留this
          let _this = this;

          //http://192.168.0.40:9900/ac/oauth/token?username=admin&password=a1234567&grant_type=password&scope=server&code=jmcr&randomStr=123

          let postParams = this.qs.stringify({
            username: _this.loginForm.userName,
            password: _this.loginForm.passWord,
            grant_type: "password",
            scope: "server",
            code: "jmcr",
            randomStr: "123"
          });
          this.axios({
            method: "post",
            url: "http://192.168.0.40:9900/ac/oauth/token",
            data: postParams,
            headers: { authorization: "Basic dGVzdDp0ZXN0" }
          })
            .then(res => {
              if (res.data) {
                //把当前用户token数据存入state
                _this.$store.commit("SAVE_TOKEN", res.data);
                //传给后台的token值
                let tokenValue =
                  res.data.token_type + " " + res.data.access_token;
                //获取用户信息
                this.axios
                  .get("http://192.168.0.40:9900/uc/sys/user/info", {
                    headers: { authorization: tokenValue }
                  })
                  .then(res => {
                    if (res.data && res.data.code === 0) {
                      //把当前用户信息存入state
                      _this.$store.commit(
                        "SAVE_USERINFO",
                        res.data.data.sysUser
                      );
                      _this.$message({
                        message: "恭喜你，登录成功！",
                        type: "success"
                      });
                      // 跳转到后台首页
                      //思考：根据网友的经验，是我路由跳转和路由拦截的 path 冲突了
                      //解决：不影响操作，只需要把登陆按钮那里添加一个错误异常抛出就行即可: .catch(() => {})；
                      _this.$router
                        .push("/PlatformOrganizationManagement") //默认跳转页面
                        .catch(() => {});
                    }
                  });
              }
            })
            .catch(error => {
              _this.$message.error("请检查用户名和密码！");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
html,
body {
  margin: 0;
  padding: 0;
}
html,
body,
#app,
.login {
  height: 100%;
}

.login {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  width: 400px;
  border-radius: 4px;
  padding: 0 45px 10px 10px;
}
.title {
  font-size: 22px;
  color: #333;
  font-weight: bold;
  padding: 20px 0 20px 60px;
}
</style>
