<template>
  <div id="app">
    <!-- 显示我们的内容 -->
    <div class="header-part">顶部内容</div>
    <div class="content-box">
      <div class="nav">
        <router-link to="/home">首页</router-link>
        <br>
        <router-link to="/article">文章</router-link>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
.header-part{
  background: #98aaff;
}
.nav {
  width: 159px;
  height: 500px;
  float: left;
  background: antiquewhite;
}
.content {
  width: 800px;
  height: 500px;
  background: aliceblue;
  float: left;
}
</style>
