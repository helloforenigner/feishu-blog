import { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined, EditOutlined, KeyOutlined, DoubleLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { Card, message, Upload, Form, FloatButton, Modal, Input, Button } from 'antd';
import ImgCrop from 'antd-img-crop';
import { getUserInfoAPI, changePasswordAPI } from '@/apis/user';
import { useNavigate } from 'react-router-dom';
import './index.scss';



const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};


const beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

const UserCenter = () => {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const navigate = useNavigate();

    // 编辑弹窗相关
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm] = Form.useForm();
    const [smsSent, setSmsSent] = useState(false);
    const [smsCountdown, setSmsCountdown] = useState(0);
    const [editMode, setEditMode] = useState(false);

    // 修改密码弹窗相关
    const [pswModalOpen, setPswModalOpen] = useState(false);
    const [pswForm] = Form.useForm();

    // 发送验证码
    const sendSmsCode = async () => {
        if (!userInfo.phone) {
            message.error('请先输入手机号');
            return;
        }
        // 假设有 sendSmsCode API
        // await sendSmsCode(userInfo.phone);
        setSmsSent(true);
        setSmsCountdown(60);
        message.success('验证码已发送');
    };

    // 倒计时
    useEffect(() => {
        let timer;
        if (smsCountdown > 0) {
            timer = setTimeout(() => setSmsCountdown(smsCountdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [smsCountdown]);

    const handleChange = info => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, url => {
                setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    //获取用户空间信息
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await getUserInfoAPI();
            setUserInfo(res.data.data);
        };
        getUserInfo();
    }, []);

    // 编辑提交
    const handleEditSubmit = () => {
        editForm.validateFields().then(values => {
            // 这里可以调用后端API进行更新
            setUserInfo({ ...userInfo, ...values });
            setEditModalOpen(false);
            message.success('用户信息已更新');
        });
    };

    // 保存用户信息（手机号、简介）
    const handleSave = () => {
        // 这里可以调用后端API进行保存
        message.success('用户信息已保存');
        setUserInfo({ ...userInfo, smsCode: '' });
        setEditMode(false);
    };

    // 修改密码提交
    const handleChangePassword = async () => {
        try {
            const values = await pswForm.validateFields();
            if (values.newPassword !== values.confirmPassword) {
                message.error('两次输入的新密码不一致');
                return;
            }
            // 调用后端API
            await changePasswordAPI({
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            });
            message.success('密码修改成功，请重新登录');
            setPswModalOpen(false);
            pswForm.resetFields();
            // 可选：登出并跳转登录页
            // navigate('/login');
        } catch (err) {
            // 校验失败或API报错
        }
    };

    return (<div className="user-center">
        <Card className="container">
            <div className='avatar-box'>
                <ImgCrop rotationSlider>
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="http://127.0.0.1:4523/m1/6306180-6001202-default/file/upload"
                        beforeUpload={beforeUpload}
                        onChange={handleChange}
                    >

                        {imageUrl ? <img className='avatar-image' src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                    </Upload>
                </ImgCrop>
            </div>

            <div className='user-name' style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', marginTop: '16px' }}>
                {editMode ? (
                    <Input
                        value={userInfo.name}
                        onChange={e => setUserInfo({ ...userInfo, name: e.target.value })}
                        style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '20px', width: 180, margin: '0 auto' }}
                    />
                ) : (
                    <span>{userInfo.name}</span>
                )}
            </div>

            <div className='user-content'>
                <p>用户账号：{userInfo.account}</p>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ marginRight: 8 }}>手机号：</span>
                    {editMode ? (
                        <Input
                            value={userInfo.phone}
                            style={{ width: 120, marginRight: 8 }}
                            onChange={e => setUserInfo({ ...userInfo, phone: e.target.value })}
                            size="small"
                        />
                    ) : (
                        <span style={{ width: 120, marginRight: 8 }}>{userInfo.phone}</span>
                    )}
                    {editMode ? (
                        <Button
                            size="small"
                            onClick={() => setEditModalOpen(true)}
                        >
                            获取验证码
                        </Button>
                    ) : null}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ marginRight: 8 }}>注册时间：</span>
                    <span>{userInfo.datetime}</span>
                </div>
            </div>

            <div className='user-profile'>
                <p className='user-profile-title'>用户简介：</p>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0px' }}>
                    {editMode ? (
                        <Input.TextArea
                            className='user-profile-content user-profile-box'
                            value={userInfo.profile}
                            onChange={e => setUserInfo({ ...userInfo, profile: e.target.value })}
                            autoSize={{ minRows: 5, maxRows: 5 }}
                        />
                    ) : (
                        <div className='user-profile-content user-profile-box'>
                            {userInfo.profile || <span style={{ color: '#bbb' }}>暂无简介</span>}
                        </div>
                    )}
                </div>
            </div>

            {/* 新增保存浮动按钮，仅编辑模式下显示 */}
            {editMode && (
                <FloatButton
                    className='float-button-save'
                    tooltip={<div>保存信息</div>}
                    icon={<SaveOutlined />}
                    onClick={handleSave}
                />
            )}

            <FloatButton
                className='float-button-edit'
                tooltip={<div>修改信息</div>}
                icon={<EditOutlined />}
                onClick={() => setEditMode(true)} />
            <FloatButton
                className='float-button-modify-psw'
                tooltip={<div>修改密码</div>}
                icon={<KeyOutlined />}
                onClick={() => setPswModalOpen(true)} />
            <FloatButton
                className='float-button-return'
                tooltip={<div>返回首页</div>}
                icon={<DoubleLeftOutlined />}
                onClick={() => navigate('/layout')} />

        </Card>

        <Modal
            open={editModalOpen}
            title="请输入验证码"
            onCancel={() => setEditModalOpen(false)}
            onOk={() => setEditModalOpen(false)}
            okText="确定"
            cancelText="取消"
        >
            <Input
                placeholder="验证码"
                value={userInfo.smsCode || ''}
                onChange={e => setUserInfo({ ...userInfo, smsCode: e.target.value })}
                style={{ width: '60%' }}
            />
        </Modal>

        <Modal
            open={editModalOpen}
            title="编辑用户信息"
            onCancel={() => setEditModalOpen(false)}
            onOk={handleEditSubmit}
            okText="保存"
            cancelText="取消"
        >
            <Form form={editForm} initialValues={{
                name: userInfo.name,
                phone: userInfo.phone,
                profile: userInfo.profile
            }} layout="vertical">
                {/* <Form.Item label="用户名" name="name" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input />
                </Form.Item> */}
                <Form.Item label="手机号" name="phone" rules={[{ required: true, message: '请输入手机号' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="验证码" name="smsCode" rules={[{ required: true, message: '请输入验证码' }]}>
                    <Input style={{ width: '60%' }} />
                    <Button
                        style={{ marginLeft: 8 }}
                        disabled={smsCountdown > 0}
                        onClick={sendSmsCode}
                    >
                        {smsCountdown > 0 ? `${smsCountdown}s后重发` : '获取验证码'}
                    </Button>
                </Form.Item>
                {/* <Form.Item label="用户简介" name="profile">
                    <Input.TextArea rows={3} />
                </Form.Item> */}
            </Form>
        </Modal>

        <Modal
            open={pswModalOpen}
            title="修改密码"
            onCancel={() => setPswModalOpen(false)}
            onOk={handleChangePassword}
            okText="确定"
            cancelText="取消"
        >
            <Form form={pswForm} layout="vertical">
                <Form.Item label="原密码" name="oldPassword" rules={[{ required: true, message: '请输入原密码' }]}>
                    <Input.Password autoComplete="current-password" />
                </Form.Item>
                <Form.Item label="新密码" name="newPassword" rules={[{ required: true, message: '请输入新密码' }]}>
                    <Input.Password autoComplete="new-password" />
                </Form.Item>
                <Form.Item label="确认新密码" name="confirmPassword" rules={[{ required: true, message: '请再次输入新密码' }]}>
                    <Input.Password autoComplete="new-password" />
                </Form.Item>
            </Form>
        </Modal>

    </div>);
}

export default UserCenter;