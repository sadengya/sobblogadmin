import http from './http'

export const success_code = 20000
export const failed_code = 40000

//解析token
export const checkToekn = () => {
    return http.requestGet('/user/check-token')
}
//登录
export const doLogin = (verifyCode, verifyKey, user) => {
    return http.requestPost('/user/login/' + verifyCode + '/' + verifyKey + '?from=p_', user)
}
//获取分类列表
export const listCategories = () => {
    return http.requestGet('/admin/category/list')
}
//删除分类
export const deleteCategoryById = (categoryId) => {
    return http.requestDelete('/admin/category/' + categoryId)
}
//添加分类
export const postCategory = (category) => {
    return http.requestPost('/admin/category/', category)
}
//更新分类
export const putCategory = (categoryId, category) => {
    return http.requestPut('/admin/category/' + categoryId, category)
}
//获取轮播图列表
export const listLoop = () => {
    return http.requestGet('/admin/loop/list')
}//添加轮播图
export const postLoop = (loop) => {
    return http.requestPost('/admin/loop', loop)
}
//删除轮播图
export const deleteLoop = (loopId) => {
    return http.requestDelete('/admin/loop/' + loopId)
}
//更新轮播图
export const updateLoop = (loopId, loop) => {
    return http.requestPut('/admin/loop/' + loopId, loop)
}
//获取用户列表
export const listUsers = (page, size) => {
    return http.requestGet('/user/list/?page=' + page + '&size=' + size)
}
//获取用户列表
export const doUserSearch = (userName, email) => {
    return http.requestGet('/user/list/?page=1&size=10&userName=' + userName + "&email=" + email)
}
//删除用户
export const deleteUserById = (userId) => {
    return http.requestDelete('/user/' + userId)
}
//重置密码
export const resetPassword = (userId, newPassword) => {
    return http.requestPut('/user/reset-password/' + userId + '?&password=' + newPassword)
}
//获取邮箱验证码
export const getVerifyCode = (newEmail, type) => {
    return http.requestGet('/user/verify_code?email=' + newEmail + '&type=' + type)
}
//更新邮箱地址
export const updateEmailAddress = (newEmail, verifyCode) => {
    return http.requestPut('/user/email?email=' + newEmail + '&verify_code=' + verifyCode)
}
//检查用户名是否已经存在
export const checkUserName = (userName) => {
    return http.requestGet('/user/user_name?userName=' + userName)
}
//更新用户信息
export const updateUserInfo = (userInfo, userId) => {
    return http.requestPut('/user/user_info/' + userId, userInfo)
}
//获取网站seo信息
export const getSeoInfo = () => {
    return http.requestGet('/admin/website_info/seo')
}
//获取网站标题
export const getWebsiteTitle = () => {
    return http.requestGet('/admin/website_info/title')
}
//更新网站标题
export const updateWebsiteTitle = (title) => {
    return http.requestPut('/admin/website_info/title?title=' + title)
}
//更新网站seo信息
export const updateWebsiteSeo = (description, keywords) => {
    return http.requestPut('/admin/website_info/seo?description=' + description + '&keywords=' + keywords)
}
//获取友情链接列表
export const listFriendLinks = () => {
    return http.requestGet('/admin/friend_link/list')
}
//更新友情链接列表
export const postFriendLink = (friendLink) => {
    return http.requestPut('/admin/friend_link/' + friendLink.id, friendLink)
}
//添加友情链接列表
export const addFriendLink = (friendLink) => {
    return http.requestPost('/admin/friend_link', friendLink)
}
