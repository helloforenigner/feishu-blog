import { Card, Form, Input, Button, Modal, message, Radio } from 'antd'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { getCaptchaAPI, sliderVerifyPassAPI } from '@/apis/user'
import { AES_encrypt } from '@/utils/crypto'
import { fetchLogin } from '@/store/modules/user'
import Slider from '@/pages/Login/components/SliderVerify'
import SliderCaptcha from 'rc-slider-captcha';
import bg from 'src/assets/captcha/bg.jpg';
import puzzle from 'src/assets/captcha/puzzle.png';
import { inRange, sleep } from 'ut2';
export const Login = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const [role, setRole] = useState(0)

    const [accountState, setAccountState] = useState('')


    const [showModal, setShowModal] = useState(false)
    const [showSlider, setShowSlider] = useState(false)
    const [verifySuccess, setVerifySuccess] = useState(false)

    const register = () => {
        navigate('/register')
    }


    const verifyCaptcha = async (data) => {
        // await sleep();
        console.log(data);
        if (data && inRange(data.x, 85, 95)) {
            return Promise.resolve();
        }
        return Promise.reject();
    };

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
                //角色标签存储会话
                sessionStorage.setItem('role', role)
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

    // //滑块验证结果回调
    // const resultClick = (e) => {
    //     if (e === 0) {
    //         console.log('成功');
    //         setTimeout(() => {
    //             setShowSlider(false)
    //             setVerifySuccess(true)
    //             sliderVerifyPassAPI({ account: accountState })
    //         }, 600);

    //     } else if (e === 1) {
    //         console.log('失败');
    //     }
    // }

    return (
        <div className="login">

            <Card title="Blog管理系统" className="login-container">
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
                styles={{
                    body: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    },
                }}
            >
                {/* <Slider showSlider={showSlider} resultClick={resultClick} /> */}
                <SliderCaptcha
                    request={async () => { return { bgUrl: bg, puzzleUrl: puzzle }; }}
                    onVerify={async (data) => {
                        console.log(data);
                        try {
                            await verifyCaptcha(data); // 如果 reject，会跳转到 catch
                            // 验证成功逻辑
                            setTimeout(() => {
                                setShowSlider(false)
                                setVerifySuccess(true)
                                sliderVerifyPassAPI({ account: accountState })
                            }, 600);
                            message.success('验证成功！');
                            return Promise.resolve();
                        } catch (error) {
                            // 处理验证失败的情况
                            message.error('滑块验证不通过，请重试');
                            return Promise.reject(error); // 可选：通知组件验证失败
                        }
                    }}
                />
                {/* {verifySuccess ? <p>验证成功，请返回继续登录！</p> : null} */}
            </Modal>
        </div>
    )
}