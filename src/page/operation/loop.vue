<template>
  <div class="loop-box">
    <div class="loop-action-box">
      <el-button type="primary" size="medium" @click="showAddLoop"
      >添加轮播图
      </el-button
      >
    </div>
    <div class="loop-list-box">
      <el-table :data="loops" style="width: 100%" v-loading="loading">
        <el-table-column fixed prop="id" label="ID" width="200">
        </el-table-column>
        <el-table-column label="轮播图标题">
          <template slot-scope="scope">
            <a class="loop-title" :href="scope.row.targetUrl" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column label="轮播图" width="200">
          <template slot-scope="scope">
            <el-image fit="contain" class="loop-image" :src="scope.row.imageUrl" width="200px"
                      height="100px"></el-image>
          </template>
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
    <div class="loop-dialog-box">
      <el-dialog
          title="警告"
          :visible.sync="deleteDialogShow"
          width="400px"
          :close-on-click-modal="false"
      >
        <span>你确定要删除： [{{ deleteMessage }}] 这个轮播图吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button
              @click="deleteDialogShow = false"
              size="medium"
              type="danger"
          >
            取 消
          </el-button>
          <el-button type="primary" @click="doDeleteItem" size="medium"
          >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 添加/编辑的dialog -->
      <el-dialog
          :title="editTitle"
          :visible.sync="editDialogShow"
          width="600px"
          :close-on-click-modal="false"
      >
        <div class="loop-edit-box">
          <el-form label-width="100px" size="medium">
            <el-form-item label="轮播图标题" required>
              <el-input v-model="loop.title"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接" required>
              <el-input v-model="loop.targetUrl"></el-input>
            </el-form-item>
            <el-form-item label="顺序" required>
              <el-input-number
                  v-model="loop.order"
                  :min="1"
                  :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-select placeholder="请选择状态" v-model="loop.state">
                <el-option label="已删除" value="0"></el-option>
                <el-option label="正常" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                  class="avatar-uploader"
                  action="/admin/image/loop"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :before-upload="beforeUpload">
                <el-image v-if="loop.imageUrl!==''" :src="loop.imageUrl" class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogShow = false" size="medium" type="danger">取 消
          </el-button>
          <el-button type="primary" @click="addLoop" size="medium">
            {{ editCommitText }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as dateUtil from "../../utils/date";
import * as api from "../../api/api";

export default {
  data() {
    return {
      editCommitText: "修改分类",
      editTitle: "编辑分类",
      deleteDialogShow: false,
      editDialogShow: false,
      deleteMessage: "",
      loading: false,
      loops: [],
      loop: {
        id: '',
        title: '',
        order: 1,
        state: '1',
        targetUrl: '',
        imageUrl: '',
      }
    }
  },
  methods: {
    resetLoop() {
      this.loop = {
        id: '',
        title: '',
        order: 1,
        state: '1',
        targetUrl: '',
        imageUrl: '',
      }
    },
    uploadSuccess(response) {
      if (response.code === api.success_code) {
        //上传成功
        //回显图片
        this.loop.imageUrl = 'http://localhost:2021/portal/image/' + response.data.id;
        this.$message.success(response.message)
      } else {
        this.$message.error(response.message)
      }
    },
    beforeUpload() {
      console.log("before upload ...")
    },
    addLoop() {
      //添加记录
      //检查数据
      if (this.loop.title === '') {
        this.$message.error("标题不可以为空")
        return
      }
      if (this.loop.targetUrl === '') {
        this.$message.error("跳转链接不可以为空")
        return
      }
      if (!this.loop.targetUrl.startsWith('http://') && !this.loop.targetUrl.startsWith('https://')) {
        this.$message.error("跳转链接格式错误")
        return
      }
      if (this.loop.imageUrl === '') {
        this.$message.error("轮播图不可以为空")
        return
      }
      if (this.loop.id === '') {
        //添加逻辑
        //提交数据
        api.postLoop(this.loop).then(response => {
          this.editDialogShow = false
          if (response.code === api.success_code) {
            this.resetLoop()
            this.$message.success(response.message)
            //更新列表
            this.listLoop();
          } else {
            this.$message.error(response.message)
          }
        })
      }else {
        //更新逻辑
        api.updateLoop(this.loop.id,this.loop).then(response => {
          this.editDialogShow = false
          if (response.code === api.success_code) {
            this.resetLoop()
            this.$message.success(response.message)
            //更新列表
            this.listLoop();
          } else {
            this.$message.error(response.message)
          }
        })
      }

    },
    deleteRow(item) {
      //不是立马删除，而是给出提示
      this.deleteDialogShow = true;
      this.deleteMessage = item.title;
      this.deleteTargetId = item.id;
    },
    doDeleteItem() {
      api.deleteLoop(this.deleteTargetId).then(response => {
        this.deleteDialogShow = false;
        if (response.code === api.success_code) {
          this.resetLoop('loopForm')
          this.$message.success(response.message)
          //更新列表
          this.listLoop();
        }
      })
    },
    edit(item) {
      this.loop.id = item.id;
      this.loop.title = item.title;
      this.loop.order = item.order;
      this.loop.state = item.state;
      this.loop.targetUrl = item.targetUrl;
      this.loop.imageUrl = item.imageUrl;
      this.editDialogShow = true
      this.editTitle = '编辑轮播图'
      this.editCommitText = '修 改'

    },
    showAddLoop() {
      this.resetLoop()
      this.editDialogShow = true
      this.editTitle = '添加轮播图'
      this.editCommitText = '添 加'
    },
    listLoop() {
      this.loading = true;
      api.listLoop().then(response => {
        this.loading = false;
        if (response.code === api.success_code) {
          this.loops = response.data;
        }
      })
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtil.formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
  },
  mounted() {
    this.listLoop();
  }
};
</script>

<style>
.loop-image {
  width: 180px;
  height: 80px;
  padding: 4px;
  border-radius: 4px;
  border: #ededed solid 1px;
}

.loop-edit-box .avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.loop-edit-box .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.loop-edit-box .el-upload img {
  width: 178px;
  height: 178px;
}

.loop-title {
  text-decoration: none;
}
</style>
