import { Card, Form, Input, Button, Modal, message, Radio } from 'antd'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { getCaptchaAPI, sliderVerifyPassAPI } from '@/apis/user'
import { AES_encrypt } from '@/utils/crypto'
import { fetchLogin } from '@/store/modules/user'
import Slider from '@/pages/Login/components/SliderVerify'


export const Login = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [role, setRole] = useState(0)

    const [accountState, setAccountState] = useState('')


    const [showModal, setShowModal] = useState(false)
    const [showSlider, setShowSlider] = useState(false)
    const [verifySuccess, setVerifySuccess] = useState(false)

    const [errorCnt, setErrorCnt] = useState(0)
    const register = () => {
        navigate('/register')
    }

    // 测试账号密码
    const testUsers = [
        { account: 'admin', password: '123456', role: 1 },
        { account: 'user', password: '111111', role: 0 }
    ];

    // TODO: 后期如需和后端交互获取用户信息，删除 testUsers 相关逻辑，改为调用 loginAPI，并根据后端返回的用户信息（如 role/token）进行跳转和存储。
    // 示例：
    // const res = await loginAPI(values);
    // if (res && res.data && res.data.data) {
    //     const { role, token } = res.data.data;
    //     localStorage.setItem('userRole', role);
    //     localStorage.setItem('token', token);
    //     if (role === 1 || role === '1') {
    //         navigate('/layout');
    //     } else {
    //         navigate('/home');
    //     }
    //     return;
    // }
    // message.error('账号或密码错误!');
    // setErrorCnt(errorCnt + 1);
    // if (errorCnt > 3) {
    //     setShowModal(true);
    //     setShowSlider(true);
    // }
    // 其余 testUsers 相关代码可全部移除。

    //登录角色切换
    const loginRoleChange = (e) => {
        //console.log(e.target.value)
        if (e.target.value === 0) {
            setRole(0)
        } else if (e.target.value === 1) {
            setRole(1)
        }
    }
    //登录逻辑
    const onFinish = async (values) => {
        // 测试账号密码判断
        // const found = testUsers.find(u => u.account === values.account && u.password === values.password);
        // if (found) {
        //     setErrorCnt(0);
        //     // 存储角色到 localStorage，供 layout 页面使用
        //     localStorage.setItem('userRole', found.role);
        //     // 普通用户跳转 /home，超管跳转 /layout
        //     if (found.role === 1 || found.role === '1') {
        //         navigate('/layout');
        //     } else {
        //         navigate('/home');
        //     }
        //     return;
        // } else {
        //     message.error("账号或密码错误!")
        //     setErrorCnt(errorCnt + 1)
        //     if (errorCnt > 3) {
        //         //弹出滑块验证
        //         setShowModal(true)
        //         setShowSlider(true)
        //     }
        // }
        //是否需要滑块验证操作
        const account = values.account
        const encrypt_password = AES_encrypt(values.password)//密码加密
        setAccountState(account)
        const reqData = {
            account,
            password: encrypt_password,
            tags: role
        }

        const captchaRes = await getCaptchaAPI(reqData)

        if (captchaRes.data.code === 1) {

            const res = await dispatch(fetchLogin({ ...values, password: encrypt_password, tags: role }))
            if (res.data.code === 1) {
                alert("登录成功")
                if (role === 0) {
                    //navigate('/home')
                    navigate('/layout')
                } else {
                    navigate('/layout')
                }

            } else {
                alert(res.data.msg)
            }
        } else {
            setShowModal(true)
            setShowSlider(true)
        }


        //console.log(res)
    }

    //滑块验证结果回调
    const resultClick = (e) => {
        if (e === 0) {
            console.log('成功');
            setTimeout(() => {
                setShowSlider(false)
                setVerifySuccess(true)
                sliderVerifyPassAPI({ account: accountState })
            }, 600);

        } else if (e === 1) {
            console.log('失败');
        }
    }

    return (
        <div className="login">

            <Card title="blog管理系统" className="login-container">
                <Radio.Group
                    defaultValue={0}
                    onChange={loginRoleChange}>
                    <Radio.Button value={0}>用户登录</Radio.Button>
                    <Radio.Button value={1}>超管登录</Radio.Button>
                </Radio.Group>
                <Form onFinish={onFinish}>
                    <Form.Item
                        label="账号"
                        name="account"
                        rules={[{ required: true, message: '请输入账号!' }]}>
                        <Input size="large" placeholder="请输入账号" />
                    </Form.Item>
                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}>
                        <Input.Password size="large" placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item className='button-box'>
                        <Button type="primary" htmlType="submit" size="large">
                            立即登录
                        </Button>
                        {role === 0 ? <Button onClick={register} className='register-button' type="primary" htmlType="button" size="large">
                            注册
                        </Button> : null}
                    </Form.Item>
                </Form>

            </Card>


            <Modal
                open={showModal}
                title="滑块验证"
                footer={null}
                mask={true}
                maskClosable={false}
                onCancel={() => {
                    setShowModal(false)
                    setVerifySuccess(false)
                }}
            >
                <Slider showSlider={showSlider} resultClick={resultClick} />
                {verifySuccess ? <p>验证成功，请返回继续登录！</p> : null}
            </Modal>
        </div>
    )
}