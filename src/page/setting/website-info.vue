<template>
  <div class="setting-website-info-box">
    <el-form label-width="100px" size="medium">
      <el-form-item label="网站名称">
        <el-input type="text" v-model="websiteTitle"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字">
        <el-input v-model="keywords" placeholder="关键字请用”,“隔开"></el-input>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input type="textarea"
                  :rows="3"
                  v-model="description">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSeoInfo">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as api from "../../api/api";

export default {
  data() {
    return {
      websiteTitle: '',
      keywords: '',
      description: '',
      oldInfo: {
        websiteTitle: '',
        keywords: '',
        description: '',
      }
    }
  },
  methods: {
    updateSeoInfo() {
      //检查数据
      if (this.websiteTitle === '') {
        this.$message.error('网站标题不可以为空')
        return
      }
      if (this.keywords === '') {
        this.$message.error('网站关键字不可以为空')
        return
      }
      if (this.description === '') {
        this.$message.error('网站描述不可以为空')
        return
      }
      //seo关键字不一样的时候
      let isSeoInfoUpdate = false
      if (this.description !== this.oldInfo.description || this.keywords !== this.oldInfo.keywords) {
        isSeoInfoUpdate = true
        api.updateWebsiteSeo(this.description, this.keywords).then(response => {
          if (response.code === api.success_code) {
            this.$message.success(response.message)
            this.getWebsiteTitle()
          }
        })
      }
      //提交数据
      if (this.websiteTitle !== this.oldInfo.websiteTitle) {
        //更新一下标题
        api.updateWebsiteTitle(this.websiteTitle).then(response => {
          if (response.code === api.success_code) {
            if (!isSeoInfoUpdate) {
              this.$message.success(response.message)
            }
            this.getWebsiteTitle()
          }
        })
      }
    },
    getWebsiteInfo() {
      api.getSeoInfo().then(response => {
        if (response.code === api.success_code) {
          this.keywords = response.data['website_keywords']
          this.description = response.data['website_description']
          this.oldInfo.keywords = this.keywords
          this.oldInfo.description = this.description
        }
      })
    },
    getWebsiteTitle() {
      api.getWebsiteTitle().then(response => {
        if (response.code === api.success_code) {
          //console.log(response)
          this.websiteTitle = response.data.value
          this.oldInfo.websiteTitle = this.websiteTitle
        }
      })
    }
  },
  mounted() {
    this.getWebsiteInfo()
    this.getWebsiteTitle()
  }

}
</script>

<style>
.setting-website-info-box .el-input, .setting-website-info-box .el-textarea {
  width: 500px;
}
</style>