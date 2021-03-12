import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

/*登录页面*/
const login = () => import("@/page/login/login");
/*内容部分*/
const manageArticle = () => import("@/page/content/manage-article");
const manageComment = () => import("@/page/content/manage-comment");
const manageImage = () => import("@/page/content/manage-image");
const postArticle = () => import("@/page/content/post-article");
/*首页*/
const index = () => import("@/page/dashboard/index");
/*运营*/
const manageCategory = () => import("@/page/operation/manage-category");
const loop = () => import("@/page/operation/loop");
/*设置*/
const friendLink = () => import("@/page/setting/friend-link");
const websiteInfo = () => import("@/page/setting/website-info");
const email = () => import("@/page/setting/email");
const info = () => import("@/page/setting/info");
/*用户*/
const list = () => import("@/page/user/list");
/*布局*/
const baseView = () => import("@/layout/base-view");
const rightView = () => import("@/layout/right-content");

export const routes = [
    {
        path: '',
        component: baseView,
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: '首页',
                icon: 'el-icon-s-home',
                hidden: false,
                component: index
            },
            {
                path: '/content',
                name: '内容',
                icon: 'el-icon-tickets',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'manage-article',
                        name: '文章管理',
                        icon: 'el-icon-document',
                        hidden: false,
                        component: manageArticle
                    },
                    {
                        path: 'manage-comment',
                        icon: 'el-icon-chat-line-round',
                        name: '评论管理',
                        hidden: false,
                        component: manageComment
                    },
                    {
                        path: 'manage-image',
                        icon: 'el-icon-picture-outline',
                        name: '图片管理',
                        hidden: false,
                        component: manageImage
                    },
                    {
                        path: 'post-article',
                        name: '发表文章',
                        icon: 'el-icon-edit-outline',
                        hidden: false,
                        component: postArticle
                    }
                ]
            },
            {
                path: '/user',
                icon: 'el-icon-user',
                hidden: false,
                name: '用户',
                component: rightView,
                children: [
                    {
                        path: 'list',
                        name: '用户列表',
                        icon: 'el-icon-user',
                        hidden: false,
                        component: list
                    }
                ]
            },
            {
                path: '/operation',
                name: '运营',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'loop',
                        name: '轮播图管理',
                        hidden: false,
                        component: loop
                    },
                    {
                        path: 'manage-category',
                        name: '分类管理',
                        hidden: false,
                        component: manageCategory
                    }
                ]
            },
            {
                path: '/setting',
                name: '设置',
                hidden: false,
                component: rightView,
                children: [
                    {
                        path: 'friend-link',
                        name: '友情链接',
                        hidden: false,
                        component: friendLink
                    },
                    {
                        path: 'website-info',
                        name: '网站信息',
                        hidden: false,
                        component: websiteInfo
                    },
                    {
                        path: 'email',
                        name: '邮箱设置',
                        icon: 'el-icon-message',
                        hidden: false,
                        component: email
                    },
                    {
                        path: 'info',
                        name: '用户信息',
                        icon: 'el-icon-warning-outline',
                        hidden: false,
                        component: info
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: login
    }
];

const router = new VueRouter({
    routes
});

export default router;