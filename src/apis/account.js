//封装与账号管理相关的接口函数
import { request } from "@/utils/request"

//1、获取账号列表
export function getAccountListAPI(params) {
    return request({
        url: "/admin/users",
        method: "GET",
        params
    })
}

//2、获取账号详情
export function getAccountDetailAPI(id) {
    return request({
        url: `/admin/users/${id}`,
        method: "GET"
    })
}

//3、用户状态管理
export function updateAccountStatusAPI(id, data) {
    return request({
        url: `/admin/users/${id}`,
        method: "PUT",
        data
    })
}