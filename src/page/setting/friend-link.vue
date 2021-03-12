<template>
  <div class="setting-friend-link-box">
    <div class="friend-link-action-box">
      <el-button type="primary" size="medium" @click="showFriendLinkDialog">添加友情链接</el-button>
    </div>
    <div class="friend-link-list-box">
      <el-table :data="links" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="200">
        </el-table-column>
        <el-table-column label="对方网站名称">
          <template slot-scope="scope">
            <a class="friend-link-title" :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column label="logo" width="200">
          <template slot-scope="scope">
            <el-image fit="cover" :src="'http://localhost:2021'+scope.row.logo"></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="order" label="顺序" width="200">
        </el-table-column>
        <el-table-column label="创建日期" width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column label="更新日期" width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="primary" size="small"
            >编辑
            </el-button
            >
            <el-button type="danger" size="small" @click="deleteRow(scope.row)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="friend-link-dialog">
      <!-- 添加/编辑的dialog -->
      <el-dialog
          :title="editTitle"
          :visible.sync="editDialogShow"
          width="600px"
          :close-on-click-modal="false"
      >
        <div class="loop-edit-box">
          <el-form label-width="120px" size="medium">
            <el-form-item label="对方网站名称" required>
              <el-input v-model="friendLink.name"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" required>
              <el-input v-model="friendLink.url"></el-input>
            </el-form-item>
            <el-form-item label="顺序" required>
              <el-input-number
                  v-model="friendLink.order"
                  :min="1"
                  :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select placeholder="请选择状态" v-model="friendLink.state">
                <el-option label="已删除" value="0"></el-option>
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="logo">
              <div class="friend-link-image-upload" @click="showFriendLinkCut=true">
                <i class="el-icon-plus" v-if="friendLink.logo===''"></i>
                <el-image v-else :src="'http://localhost:2021'+friendLink.logo"></el-image>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogShow = false" size="medium" type="danger">取 消
          </el-button>
          <el-button type="primary" @click="addFriendLink" size="medium">
            {{ editCommitText }}
          </el-button>
        </span>
      </el-dialog>
      <avatar-upload field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showFriendLinkCut"
                     :width="200"
                     :height="72"
                     url="/admin/image/link"
                     img-format="png"
      ></avatar-upload>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'
import * as dateUtil from "../../utils/date";
import avatarUpload from 'vue-image-crop-upload';

export default {
  data() {
    return {
      showFriendLinkCut: false,
      editCommitText: '',
      editDialogShow: false,
      editTitle: '添加友情链接',
      loading: false,
      links: [],
      friendLink: {
        id: '',
        name: '',
        logo: '',
        order: 0,
        state: '1',
        url: ''
      }
    }
  },
  components: {
    'avatar-upload': avatarUpload
  },
  methods: {
    edit(item) {
      console.log(item)
      this.friendLink.name = item.name
      this.friendLink.order = item.order
      this.friendLink.state = item.state
      this.friendLink.logo = item.logo
      this.friendLink.url = item.url
      this.friendLink.id = item.id
      this.editCommitText = '修改'
      this.editTitle = '修改友情链接'
      this.editDialogShow = true
    },
    cropUploadFail() {
      this.$message.error('上传失败')
    },
    cropUploadSuccess(response) {
      if (response.code === api.success_code) {
        this.$message.success(response.message)
        console.log(response)
        //上传成功
        this.friendLink.logo = '/portal/image/' + response.data.id;
      } else {
        this.$message.error(response.message)
      }
    },
    showFriendLinkDialog() {
      this.editDialogShow = true
      this.editCommitText = '添 加'
      this.resetFriendLink()
    },
    addFriendLink() {
      //添加
      //检查内容
      if (this.friendLink.name === '') {
        this.$message.error('链接名称不可以为空')
        return
      }
      if (this.friendLink.url === '') {
        this.$message.error('链接地址不可以为空')
        return
      }
      if (this.friendLink.logo === '') {
        this.$message.error('logo不可以为空')
        return
      }
      //提交数据
      api.addFriendLink(this.friendLink).then(response => {
        if (response.code === api.success_code) {
          this.editDialogShow = false
          this.$message.success(response.message)
          this.listLinks()
          //重置内容
          this.resetFriendLink()
        } else {
          this.$message.error(response.message)
        }
      })

    },
    resetFriendLink() {
      this.friendLink = {
        id: '',
        name: '',
        logo: '',
        order: 1,
        state: '1',
        url: ''
      }
    },
    listLinks() {
      api.listFriendLinks().then(response => {
        if (response.code === api.success_code) {
          this.links = response.data
        }
      })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtil.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  mounted() {
    this.listLinks()
  }

}
</script>

<style>
.friend-link-title {
  text-decoration: none;
}

.friend-link-image-upload {
  text-align: center;
  cursor: pointer;
  width: 100px;
  height: 50px;
}
</style>