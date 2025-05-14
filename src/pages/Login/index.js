import { Card, Form, Input, Button, Modal, message, Radio } from 'antd'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginAPI } from '@/apis/user'
import { AES_encrypt } from '@/utils/crypto'
import Slider from '@/pages/Login/components/SliderVerify'


export const Login = () => {
    const navigate = useNavigate()

    const [role, setRole] = useState('user')


    const [showModal, setShowModal] = useState(false)
    const [showSlider, setShowSlider] = useState(false)
    const [verifySuccess, setVerifySuccess] = useState(false)

    const [errorCnt, setErrorCnt] = useState(0)
    const register = () => {
        navigate('/register')
    }

    //登录角色切换
    const loginRoleChange = (e) => {
        console.log(e.target.value)
        if (e.target.value === 'user') {
            setRole('user')
        } else if (e.target.value === 'admin') {
            setRole('admin')
        }
    }
    //登录逻辑
    const onFinish = async (values) => {
        if (values.account == 'admin' && values.password == '123456') {
            setErrorCnt(0)
            navigate('/layout')
        } else {
            message.error("账号或密码错误!")
            setErrorCnt(errorCnt + 1)
            if (errorCnt > 3) {
                //弹出滑块验证
                setShowModal(true)
                setShowSlider(true)
            }
        }
        //const encrypt_password = AES_encrypt(values.password, '')//密码加密
        //const res = await loginAPI({ ...values, password: encrypt_password, tags: 1 })
        //console.log(res.data.data.token)


    }

    //滑块验证结果回调
    const resultClick = (e) => {
        if (e == 0) {
            console.log('成功');
            setTimeout(() => {
                setShowSlider(false)
                setVerifySuccess(true)

            }, 600);

        } else if (e == 1) {
            console.log('失败');
        }
    }

    return (
        <div className="login">

            <Card title="blog管理系统" className="login-container">
                <Radio.Group
                    defaultValue="user"
                    onChange={loginRoleChange}>
                    <Radio.Button value="user">用户登录</Radio.Button>
                    <Radio.Button value="admin">超管登录</Radio.Button>
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
                        {role === 'user' ? <Button onClick={register} className='register-button' type="primary" htmlType="button" size="large">
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