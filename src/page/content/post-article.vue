<template>
  <div class="article-post-box">
    <!--标题-->
    <div class="article-title-part">
      <el-input v-model="article.title" placeholder="请输入标题(8-64个字符)"
                minlength="8"
                maxlength="64"
                show-word-limit>

      </el-input>
    </div>
    <!--内容-->
    <div class="article-post-part">
      <mavon-editor
          v-model="article.content"
          @htmlCode="htmlCode"
          @change="onContentChange"
      />
    </div>
    <!--
    文章设置：分类，封面，标签
    -->
    <div class="article-post-setting-part">
      <el-form label-width="100px">
        <el-form-item label="文章分类" prop="name" required>
          <el-select v-model="article.categoryId" placeholder="请选择分类" size="medium">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="region" required>
          <el-input type="textarea"
                    :rows="3"
                    placeholder="文章摘要"
                    v-model="article.summary">

          </el-input>
        </el-form-item>
        <el-form-item label="封面" required>
          <div class="article-cover-selector" @click="isImageSelectorShow=true">
            <i class="el-icon-plus" v-if="article.cover===''"></i>
            <el-image v-else :src="blog_constants.baseUrl+article.cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="标签" class="label-input-box" required>
          <el-tag
              :key="tag"
              v-for="tag in labels"
              closable
              :disable-transitions="false"
              @close="deleteLabel(tag)">
            {{ tag }}
          </el-tag>
          <el-input
              class="input-new-label"
              v-if="labelInputVisible"
              v-model="labelNewValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleLabelInputConfirm"
              @blur="handleLabelInputConfirm"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showLabelInput">+ 添加标签</el-button>
        </el-form-item>
        <!--        <el-form-item>-->
        <!--          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>-->
        <!--          <el-button @click="resetForm('ruleForm')">重置</el-button>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
    <!--发布/草稿/预览的按钮-->
    <div class="article-post-action-bar">
      <div class="action-btn-container">
        <el-button size="medium" plain>全屏预览</el-button>
        <el-button size="medium" plain>保存草稿</el-button>
        <el-button size="medium" plain type="primary">发表文章</el-button>
      </div>
    </div>
    <div class="article-post-dialog-box">
      <el-dialog
          title="图片选择"
          :visible.sync="isImageSelectorShow"
          width="600"
          :close-on-click-modal="false"
      >
        <div class="image-selector-box">
          <div class="image-action-bar clearfix">
            <el-button>上传图片</el-button>
          </div>
          <div class="image-selector-list">
            <el-image fit="contain" v-for="(item,index) in images" :key="index"
                      :src="blog_constant.baseUrl+'/portal/image/'+item.url"></el-image>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="isImageSelectorShow = false" size="medium">取 消</el-button>
    <el-button type="primary" @click="onImageSelected" size="medium">确 定</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as api from '../../api/api'

export default {
  data() {
    return {
      isImageSelectorShow: false,
      labelNewValue: '',
      labelInputVisible: false,
      labels: ['Java', 'Vue', 'Spring'],
      categories: [],
      article: {
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
      },
      images: []
    }
  },
  methods: {
    listImages() {
      api.listImages(1, 5).then(response => {
        if (response.code === api.success_code) {
          this.images = response.data.records
        } else {
          //
        }
      })
    },
    onImageSelected() {
      this.isImageSelectorShow = false
    },
    htmlCode() {

    },
    onContentChange() {

    },
    deleteLabel(label) {
      //从数组里删除
      this.labels.splice(this.labels.indexOf(label), 1)
      //todo: 处理显示输入框
    },
    handleLabelInputConfirm() {
      //回车的时候
      let labelNewValue = this.labelNewValue;
      if (labelNewValue && this.labels.length < 5) {
        this.labels.push(this.labelNewValue)
      }
      this.labelInputVisible = false;
      this.labelNewValue = '';
    },
    showLabelInput() {
      //判断个数，限制5个
      //控制输入框的显示
      if (this.labels.length < 5) {
        this.labelInputVisible = true
      } else {
        this.labelInputVisible = false
      }

    },
    listCategory() {
      api.listCategories().then(response => {
        if (response.code === api.success_code) {
          this.categories = response.data
        }
      })
    }
  },
  mounted() {
    //获取文章分类
    this.listCategory()
    //获取图片列表
    this.listImages()
  }
}
</script>

<style>
.image-selector-list img{
  float: left;
  width: 100px;
  height: 100px;
  margin: 10px;
}
.article-post-dialog-box .el-dialog__header {
  display: none;
}

.input-new-label {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.label-input-box .el-tag {
  margin-right: 10px;
}

.article-cover-selector i {
  line-height: 140px;
  font-size: 20px;
  color: #dcdfe6;
}

.article-cover-selector {
  cursor: pointer;
  width: 200px;
  height: 140px;
  border: #dcdfe6 dashed 1px;
  border-radius: 8px;
  text-align: center;
}

.article-post-setting-part .el-textarea {
  width: 400px;
}

.article-post-setting-part {
  margin-bottom: 120px;
}

.article-title-part {
  margin-bottom: 20px;
}

.article-post-part .v-note-op {
  position: sticky;
  top: -20px
}

.article-post-part {
  margin-bottom: 20px;
}

.article-post-part .markdown-body {
  height: 800px;
}

.action-btn-container {
  float: right;
  margin-right: 50px;
  padding: 10px;

}

.article-post-action-bar {
  border-top: #dcdfe6 solid 1px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-left: -240px;
  z-index: 2000;
}
</style>