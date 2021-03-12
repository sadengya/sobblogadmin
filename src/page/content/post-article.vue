<template>
  <div class="article-post-box">
    <!--标题-->
    <div class="article-title-part">
      <el-input v-model="article.title" placeholder="请输入标题"></el-input>
    </div>
    <!--内容-->
    <div class="article-post-part">

    </div>
    <!--
    文章设置：分类，封面，标签
    -->
    <div class="article-post-setting-part">

    </div>
    <!--发布/草稿/预览的按钮-->
    <div class="article-post-action-bar">
      <div class="action-btn-container clearfix">
        <el-button plain>全屏预览</el-button>
        <el-button plain>保存草稿</el-button>
        <el-button plain type="primary">发表文章</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {
        title: '',
      }
    }
  }
}
</script>

<style>
.article-post-part {
  height: 1000px;
  background: aquamarine;
}

.article-post-setting-part {
  background: aliceblue;
  height: 300px;
}

.action-btn-container {
  float: right;
  margin-right: 50px;
  padding: 10px;
}
</style>