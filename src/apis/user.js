//用户模块的API请求
import { request } from '@/utils/request';

//短信验证码请求
export function sendSmsCode(phone) {
    return request({
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "APPCODE 47fc56c02eb840e8825d974da3597d85" },
        url: '/sms/smsSend',
        method: 'POST',
        data: {
            mobile: phone,
            smsSignId: '2e65b1bb3d054466b82f0c9d125465e2',
            templateId: '908e94ccf08b4476ba6c876d13f084ad',
            param: '**code**:12345,**minute**:5'
        }
    })
}

//1、用户登录请求
export function loginAPI(formData) {
    return request({
        url: '/user/login',
        method: 'POST',
        data: formData
    })
}

//2、获取用户信息
export function getUserInfoAPI() {
    return request({
        url: '/user/center',
        method: 'GET'
    })
}

//3、修改密码
export function changePasswordAPI({ oldPassword, newPassword }) {
    return request({
        url: '/user/changePassword',
        method: 'POST',
        data: {
            oldPassword,
            newPassword
        }
    });
}