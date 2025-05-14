import { useState, useEffect } from 'react';
import { LoadingOutlined, PlusOutlined, EditOutlined, KeyOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { Card, message, Upload, Form, FloatButton } from 'antd';
import ImgCrop from 'antd-img-crop';
import { getUserInfoAPI } from '@/apis/user'
import { useNavigate } from 'react-router-dom';
import './index.scss'



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

    const navigate = useNavigate()



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
    )

    //获取用户空间信息
    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        const getUserInfo = async () => {
            const res = await getUserInfoAPI()
            setUserInfo(res.data.data)
        }
        getUserInfo()
    }, [])




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

            <div className='user-name'>
                <p>{userInfo.name}</p>
            </div>

            <div className='user-content'>
                <p>用户账号：{userInfo.account}</p>
                <p>手机号：{userInfo.phone}</p>
                <p>注册时间：{userInfo.datetime}</p>
            </div>

            <div className='user-profile'>
                <p className='user-profile-title'>用户简介：</p>
                <p className='user-profile-content'>{userInfo.profile}</p>
            </div>


            <FloatButton
                className='float-button-edit'
                tooltip={<div>编辑用户信息</div>}
                icon={<EditOutlined />}
                onClick={() => console.log('onClick')} />
            <FloatButton
                className='float-button-modify-psw'
                tooltip={<div>修改密码</div>}
                icon={<KeyOutlined />}
                onClick={() => console.log('onClick')} />
            <FloatButton
                className='float-button-return'
                tooltip={<div>返回首页</div>}
                icon={<DoubleLeftOutlined />}
                onClick={() => navigate('/layout')} />

        </Card>


    </div>)
}

export default UserCenter