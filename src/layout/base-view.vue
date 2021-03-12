<template>
  <div>
    <el-container>
      <el-header id="admin-header-box" style="height: 40px">
        <topHeader></topHeader>
      </el-header>
      <el-container class="main-container">
        <el-aside id="left-menu-list-box" width="220px">
          <leftMenu></leftMenu>
        </el-aside>
          <el-main>
              <router-view></router-view>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import leftMenu from "./left-menu.vue";

export default {
  components: {leftMenu},

  mounted() {

  },
};
</script>
<style>
#left-menu-list-box .el-menu {
  border-right: none;
}
.main-container{
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 100%;
}
.el-header {
  background-color: dodgerblue;
  line-height: 40px;
}

.el-aside {
  border-right: solid 1px #e6e6e6;
  line-height: 200px;
  height: 500px;
}
</style>