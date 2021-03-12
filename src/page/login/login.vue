<template>
  <!-- 后台的登录入口，只有登录，没有注册，也没有找回密码 -->
  <div class="admin-login-box">
    <!-- 顶部内容 -->
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">博客系统 | 登录</div>
      </div>
    </div>
    <!-- 中间内容 -->
    <div class="admin-login-center-box">
      <div class="login-center-box center">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form
              label-position="right"
              label-width="80px"
              :model="loginInfo"
            >
              <el-form-item label="账号" required>
                <el-input
                  v-model="user.userName"
                  placeholder="用户名/邮箱地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" required>
                <el-input
                  type="password"
                  v-model="user.password"
                  placeholder="密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="验证码" required>
                <el-input
                  v-model="loginInfo.verifyCode"
                  placeholder="请输入验证码"
                  @keyup.enter.native="doLogin"
                ></el-input>
                <img
                  class="captcha_code"
                  :src="captchaPath"
                  @click="updateVerifyCode"
                />
              </el-form-item>
              <el-form-item class="login-botton">
                <el-button type="primary" @click="doLogin" size="small">
                  登 录
                </el-button>
              </el-form-item></el-form
            ></el-col
          >
        </el-row>
      </div>
    </div>
    <!-- 底部内容 -->
  </div>
</template>

<script>
import { doLogin } from "../../api/api";
export default {
  data() {
    return {
      user: {
        userName: "",
        password: "",
      },
      loginInfo: {
        verifyCode: "",
        captcha_key: "",
      },
      captchaPath: "",
    };
  },
  methods: {
    toastE(msg) {
      this.$message({
        message: msg,
        center: true,
        type: "error",
      });
    },
    doLogin() {
      //发起登录
      //检查数据
      if (this.user.userName === "") {
        this.toastE("用户名不可以为空");
        return;
      }
      if (this.user.password === "") {
        this.toastE("密码不可以为空");
        return;
      }
      if (this.loginInfo.verifyCode === "") {
        this.toastE("验证码不可以为空");
        return;
      }
      //向服务器提交数据

      //处理结果
      doLogin(
        this.loginInfo.verifyCode,
        this.loginInfo.captcha_key,
        this.user
      ).then((response) => {
        //处理登录结果
        //判断状态
        if (response.code === 20000) {
          this.$message({
            message: response.message,
            center: true,
            type: "success",
          });
          //如果成功-->跳转-->判断角色. 用户跳转到首页 管理员跳转到管理中心
          //判断角色
          this.$router.push("/index");
        } else {
          //其他给出提示
          //更新验证码
          this.updateVerifyCode();
          this.toastE(response.message);
        }
      });
    },
    updateVerifyCode() {
      this.captchaPath =
        "/user/captcha?captcha_key=" +
        this.loginInfo.captcha_key +
        "&randonm" +
        Date.parse(new Date());
    },
  },
  mounted() {
    //检查登录是否有效
    //如果已经登录了，跳转到对应的页面

    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode();
  },
};
</script>

<style>
.captcha_code {
  cursor: pointer;
  width: 120px;
  height: 38px;
  vertical-align: middle;
  margin-left: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border: solid 1px #e6e6e6;
}
.center {
  margin: 0 auto;
  width: 1140px;
}
/* .admin-login-box{
    background: gray;
} */
.admin-login-header-box {
  width: 100%;
  height: 50px;
  background: dodgerblue;
  margin-bottom: 20px;
}
.admin-login-header-center {
  line-height: 50px;
}
.admin-login-logo {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}
.login-center-box .el-input {
  width: 200px;
}
.login-center-box {
  width: 1100px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 10px #afafaf;
  padding: 20px;
}
.el-form-item__label {
  text-align: center;
  background: #fbfbfb;
  padding: 0;
  border-left: #e6e6e6 solid 1px;
  border-top: #e6e6e6 solid 1px;
  border-bottom: #e6e6e6 solid 1px;
  border-radius: 0;
  height: 40px;
}
.el-input__inner {
  border-radius: 0;
}
.login-botton {
  margin-bottom: 0;
}
</style>