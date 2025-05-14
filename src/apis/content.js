//封装与内容管理相关的接口函数
import { request } from "@/utils/request"

//1、新建blog 新建成功blog状态为 未发布
export function createBlogAPI(formData) {
    return request({
        url: "/content/create",
        method: "POST",
        formData
    })
}

//2、获取blog列表
export function getBlogListAPI(params) {
    return request({
        url: "/content/list",
        method: "GET",
        params
    })
}

//3、获取blog详情
export function getBlogDetailAPI(id) {
    return request({
        url: `/content/list/${id}`,
        method: "GET"
    })
}

//4、编辑blog
export function editBlogAPI(id, data) {
    return request({
        url: `/content/edit/${id}`,
        method: "PUT",
        data
    })
}

//5、发布blog 发布成功blog状态为 已发布
export function publishBlogAPI(id) {
    return request({
        url: `/content/publish/${id}`,
        method: "GET",
    })
}

//6、删除blog 
export function deleteBlogAPI(id) {
    return request({
        url: `/content/delete/${id}`,
        method: "DELETE",
    })
}

//7、下架blog 下架成功blog状态为 未发布
export function revokeBlogAPI(id) {
    return request({
        url: `/content/revoke/${id}`,
        method: "GET",
    })
}

