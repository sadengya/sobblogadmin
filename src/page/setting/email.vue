<template>
  <div class="setting-email-box">
    <el-form label-width="100px" size="medium">
      <el-form-item
          label="新邮箱地址" required>
        <el-input v-model="newEmail"></el-input>
        <el-button type="primary" v-if="!isCounting" @click="getVerifyCode" class="email-verify-code-btn">获取验证码
        </el-button>
        <el-button type="primary" v-else class="email-verify-code-btn" disabled>
          {{ countDownText }}
        </el-button>
      </el-form-item>
      <el-form-item
          label="邮箱验证码" required>
        <el-input v-model="verifyCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEmailAddress">修改邮箱</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from "../../api/api";

export default {
  data() {
    return {
      isCounting: false,
      countDownText: '重新发送（60）',
      newEmail: '',
      verifyCode: '',
    }
  },
  methods: {
    startCountDown() {
      //禁止按钮可以使用，并且开始倒计时
      let time = 60
      let that = this
      this.isCounting = true
      let interval = setInterval(function () {
        //执行倒计时
        time--
        if (time <= 0) {
          that.isCounting = false
          clearInterval(interval)
        }
        that.countDownText = '重新发送（' + time + '）'
      }, 1000);
    },
    getVerifyCode() {
      //校验邮箱格式是否正确
      // 检查邮箱格式，判空
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.newEmail)) {
        this.$message.error('邮箱地址格式不正确')
        return
      } else {
        this.$message.success('邮箱地址正确')
      }
      //发起请求，获取验证码
      api.getVerifyCode(this.newEmail, 'update').then(response => {
        if (response.code === api.success_code) {
          this.startCountDown()
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })

    },
    updateEmailAddress() {
//内容校验
      if (this.newEmail === '') {
        this.$message.error('邮箱地址不可以为空')
        return
      }
      if (this.verifyCode === '') {
        this.$message.error('验证码不可以为空')
        return;
      }
      api.updateEmailAddress(this.newEmail, this.verifyCode).then(response => {
        if (response.code === api.success_code) {
          //更新成功 给出提示 重置表单
          this.$message.success(response.message)
          this.newEmail = ''
          this.verifyCode = ''
        } else {
          this.verifyCode=''
          this.$message.error(response.message)
        }
      })
    }
  }
}
</script>

<style>
.email-verify-code-btn {
  margin-left: 20px;
}

.setting-email-box .el-input {
  max-width: 250px;
  min-width: 250px;
}
</style>