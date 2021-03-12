<template>
  <div class="setting-user-info-box">
    <div class="user-info-list-part">
      <el-form label-width="100px" v-if="userInfo!==null" size="medium">
        <el-form-item label="用户ID">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input type="email" v-model="userInfo.email" autocomplete="off" disabled></el-input>
          <el-button type="primary" class="update-email-btn" @click="toUpdateEmailPage">修改邮箱</el-button>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="text" v-model="userInfo.userName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="签名">
          <el-input type="text" v-model="userInfo.sign" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="头像" class="user-info-avatar">
          <div class="user-avatar-container" @click="showAvatarCut=true">
            <el-avatar :src="userInfo.avatar"></el-avatar>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo()">修改用户信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-info-dialog">
      <avatar-upload field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showAvatarCut"
                     :width="300"
                     :height="300"
                     url="/admin/image/avatar"
                     img-format="png"
      ></avatar-upload>
    </div>
  </div>
</template>

<script>
import * as api from "../../api/api";
import avatarUpload from 'vue-image-crop-upload';

export default {
  components: {
    'avatar-upload': avatarUpload
  },
  data() {
    return {
      lastUserName: '',
      showAvatarCut: false,
      userInfo: null
    }
  },
  methods: {
    cropUploadFail() {
      this.$message.error('上传失败')
    },
    cropUploadSuccess(response) {
      //this.showAvatarCut = false
      if (response.code === api.success_code) {
        this.$message.success(response.message)
        console.log(response)
        //上传成功
        this.userInfo.avatar = 'http://localhost:2021/portal/image/' + response.data.id;
      } else {
        this.$message.error(response.message)
      }
    },
    toUpdateEmailPage() {
      this.$router.push('/setting/email')
    },
    updateUserInfo() {
      //检查数据
      if (this.userInfo.userName === '') {
        this.$message.error('用户名不可以为空')
        return
      }
      if (this.lastUserName === this.userInfo.userName) {
        this.doUpdateUserInfo()
      } else {
        //检查用户是否重复
        api.checkUserName(this.userInfo.userName).then(response => {
              if (response.code === api.failed_code) {
                this.doUpdateUserInfo()
              } else {
                this.$message.error(response.message)
              }
            }
        )
      }
      //头像不可以为空
    },
    doUpdateUserInfo() {
      if (this.userInfo.avatar === '') {
        this.$message.error('头像不可以为空')
        return
      }
      api.updateUserInfo(this.userInfo, this.userInfo.id).then(response => {
        if (response.code === api.success_code) {
          this.getUserInfo()
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
    },
    getUserInfo() {
      api.checkToekn().then(response => {
        if (response.code === api.success_code) {
          this.userInfo = response.data
          this.lastUserName = this.userInfo.userName
          this.$message.success(response.message)
        } else {
          this.$message.error(response.message)
        }
      })
    }
  }
  ,
  mounted() {
    this.getUserInfo()
  }

}
</script>

<style>
.user-info-avatar {
  display: inline-block;
}

.user-avatar-container {
  cursor: pointer;
  width: 100px;
}

.setting-user-info-box .el-input {
  width: 250px;
}
</style>