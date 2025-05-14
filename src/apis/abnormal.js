//封装与异常管理相关的接口函数
import { request } from "@/utils/request"

//1、获取异常信息列表
export const getAbnormalListAPI = (params) => {
    return request({
        url: "/abnormal/list",
        method: "GET",
        params
    })
}


//2、获取异常信息详情
export const getAbnormalDetailAPI = (id) => {
    return request({
        url: `/abnormal/list/${id}`,
        method: "GET"
    })
}