import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Modal,
    Input,
} from 'antd'

import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import './index.scss'

import { createBlogAPI, getBlogDetailAPI, editBlogAPI } from '@/apis/content'
import SlateEditorWithHighlightAndImage from './SlateEditorWithHighlightAndImage';

const Publish = () => {
    //编辑blog时跳转回填数据
    const [searchParams] = useSearchParams()
    const blogId = searchParams.get('id')

    // 获取表单实例
    const [form] = Form.useForm()

    // 路由跳转
    const navigate = useNavigate()

    // 用来接收 Slate 编辑器的内容
    const [editorContent, setEditorContent] = useState(null)

    useEffect(() => {
        const getBlogDetail = async () => {
            const res = await getBlogDetailAPI(blogId)
            const data = res.data.data
            form.setFieldsValue(data)
            setEditorContent(data.content)
        }
        if (blogId) {
            getBlogDetail()
        }
    }, [blogId, form])

    // 自动保存草稿（可选：只保存标题）
    const saveDraft = (content) => {
        localStorage.setItem('editorDraft', JSON.stringify(content));
    }

    // 加载草稿（只保留标题）
    useEffect(() => {
        const savedTitle = localStorage.getItem('titleDraft');
        const formdata = {
            title: savedTitle,
        }
        form.setFieldsValue(formdata)
    }, []);

    const handleChangeTitle = (e) => {
        localStorage.setItem('titleDraft', e.target.value);
    }

    // 表单提交
    const [showModal, setShowModal] = useState(false)

    const handleCancel = () => {
        setShowModal(false)
    }

    const handleOk = () => {
        setShowModal(false)
        navigate('/layout')
    }

    // 在表单提交前，把 editorContent 写回 form
    const onFinish = async (values) => {
        values.content = editorContent
        if (blogId) {
            // 编辑模式，写回 mock 数据
            // const blogList = (await import('@/mock/blogList')).default;
            // const idx = blogList.findIndex(item => String(item.id) === String(blogId));
            // if (idx !== -1) {
            //     blogList[idx] = {
            //         ...blogList[idx],
            //         ...values,
            //         date: new Date().toISOString().slice(0, 10),
            //         status: 0
            //     };
            // }
            // const res = await editBlogAPI(blogId, reqData)
            setShowModal(true);
        } else {
            await createBlogAPI(values)
            setShowModal(true)
        }
    }
    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/layout">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/layout">内容管理</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{false ? '编辑Blog' : '发布Blog'}</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 0 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入Blog标题' }]}
                        wrapperCol={{ span: 16 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Input
                                onChange={handleChangeTitle}
                                placeholder="请输入Blog标题"
                                style={{ flex: 1 }}
                            />
                            <Button
                                size="large"
                                type="primary"
                                onClick={() => form.submit()}
                                style={{ marginLeft: 16 }}
                            >
                                {blogId ? '编辑Blog' : '新建Blog'}
                            </Button>
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="内容"
                        name="content"
                        rules={[{ required: true, message: '请输入Blog内容' }]}
                        wrapperCol={{ span: 16 }}
                        style={{ height: '100%' }}
                    >
                        <div className="slate-container">
                            <SlateEditorWithHighlightAndImage
                                initialValue={editorContent}
                                onChange={value => {
                                    setEditorContent(value)
                                    saveDraft(value)
                                    form.setFieldsValue({ content: value })
                                }}
                            />
                        </div>
                    </Form.Item>
                </Form>
            </Card>
            <Modal
                title="提示"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showModal}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        确认
                    </Button>
                ]}>
                <p>您的Blog创建成功，请跳转至内容管理页面进行发布！</p>
            </Modal>
        </div>
    )
}

export default Publish