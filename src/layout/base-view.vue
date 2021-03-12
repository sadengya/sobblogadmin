<template>
  <div>
    <el-container>
      <el-header id="admin-header-box" style="height: 40px">
        <topHeader></topHeader>
      </el-header>
      <el-container>
        <el-aside id="left-menu-list-box" width="200px">
          <leftMenu></leftMenu>
        </el-aside>
        <el-container>
          <el-main>
            <div class="content">
              <router-view></router-view>
            </div
            >
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import leftMenu from "./left-menu.vue";

export default {
  components: {leftMenu},

  mounted() {
    //动态设置侧边菜单的高度
    let leftMenuBox = document.getElementById("left-menu-list-box");
    let adminHeaderBox = document.getElementById("admin-header-box").style
        .height;
    if (leftMenuBox && adminHeaderBox) {
      leftMenuBox.style.height =
          window.innerHeight - Number.parseInt(adminHeaderBox) + "px";
    }
  },
};
</script>
<style>
#left-menu-list-box .el-menu {
  border-right: none;
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