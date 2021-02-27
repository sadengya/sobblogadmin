import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const home = () => import("@/components/home");
const article = () => import("@/components/article");

const routes = [
    { path: '/home', component: home },
    { path: '/article', component: article }
  ];

const router = new VueRouter({
    routes
  });

  export default router;