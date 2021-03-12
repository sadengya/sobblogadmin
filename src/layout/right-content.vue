<template>
  <div class="right-content-container">
    <!-- 显示我们的内容 -->
    <div class="content-title-box" v-text="$route.name"></div>
    <div class="content-container-box">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {};
</script>
<style>
.content-title-box {
  padding: 5px;
  border-bottom: solid 1px #e6e6e6;
  margin-bottom: 10px;
  font-size: 20px;
  line-height: 30px;
}
</style>
