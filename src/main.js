import Vue from 'vue'
import App from './App.vue'

import router from './router'
/*Element ui*/
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu'
import topHeader from './layout/top-header'
import constants from './utils/constants'


Vue.use(ElementUI)
Vue.component('leftMenu', leftMenu)
Vue.component('topHeader', topHeader)

Vue.config.productionTip = false
Vue.prototype.blog_constant = constants

import {checkToekn} from './api/api'

router.beforeEach((to, from, next) => {
    //如果是登录页面，直接放行
    if (to.path === '/login') {
        //检查是否已经登录
        checkToekn().then(response => {
            if (response.code === 20000) {
                //已经登录，判断角色
                if (response.data.roles === 'role_admin') {
                    next('/index')
                } else {
                    //跳转到首页
                    location.href = 'https://www.baidu.com'
                }
            } else {
                //跳转到登录页面
                next()
            }
        })
        next()
    } else {
        //否则检查用户
        checkToekn().then(response => {
            if (response.code === 20000) {
                //判断角色
                //如果是管理员，放行
                if (response.data.roles === "role_admin") {
                    next()
                } else {
                    //跳转到首页
                    //普通用户跳转到门户首页
                    location.href = 'https://www.baidu.com'
                }
            } else {
                //跳转到登录页面
                next('/login')
            }
        })
    }
})

new Vue({
    router,
    render: h => h(App),
}).$mount('#app') 
