//文件API请求
//import { request } from '@/utils/request';
import axios from 'axios';

const request = axios.create({
    baseURL: 'http://geek.itheima.net/v1_0',//图片上传测试域名
    timeout: 5000 //超时时间,单位是毫秒
})

export function uploadFileAPI(formData) {
    return request({
        url: '/upload',
        method: 'POST',
        data: formData
    })
}
