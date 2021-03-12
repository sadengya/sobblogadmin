<template>
  <div>
    <el-row class="tac">
      <el-col>
        <el-menu
            :default-active="$route.path"
            class="el-menu-vertical"
            :unique-opened="true">
          <!-- 遍历菜单内容 -->
          <!-- 有两种：有子菜单，没有子菜单 -->
          <template v-for="(item, index) in menuList">
            <router-link
                v-if="!item.children && !item.hidden"
                :key="index.toString()"
                :to="item.path">
              <el-menu-item :index="item.path">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </router-link>
            <router-link
                v-if="item.children && !item.hidden"
                :key="index.toString()"
                :to="item.path">
              <el-submenu :index="item.path">
                <template slot="title">
                  <i :class="item.icon"></i>
                  <span>{{ item.name }}</span>
                </template>
                <router-link
                    v-for="(subItem, subIndex) in item.children"
                    :key="subIndex.toString()"
                    :to="item.path + '/' + subItem.path">
                  <el-menu-item
                      :index="item.path + '/' + subItem.path"
                      v-if="!subItem.hidden">
                    <i :class="subItem.icon"></i>
                    <span slot="title">{{ subItem.name }}</span>
                  </el-menu-item>
                </router-link>
              </el-submenu>
            </router-link>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {routes} from "../router";

export default {
  data() {
    return {
      menuList: [],
    };
  },
  mounted() {
    let menuList = routes[0];
    this.menuList = menuList.children;
  },
};
</script>
<style>
.el-menu-vertical a {
  text-decoration: none;
}
</style>