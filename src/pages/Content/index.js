import { Card, Breadcrumb, Modal, Input, Button, Tag, Tooltip, Table, Space, Popconfirm } from 'antd';
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBlogListAPI, publishBlogAPI, deleteBlogAPI, revokeBlogAPI } from '@/apis/content'
import { useSelector } from 'react-redux'
import './index.scss'

const { Search } = Input;


const ContentManager = () => {

    //从redux中获取用户信息
    const userInfo = useSelector(state => state.user.userInfo)

    // 1.准备请求参数
    const [reqData, setReqData] = useState({
        account1: userInfo.account,
        //account2: '',
        role: 1,
        page: 1,
        per_page: 10
    })

    //2、获取blog列表
    const [blogList, setBlogList] = useState([])

    useEffect(() => {
        //定义获取文章列表的函数
        const getBlogList = async () => {
            //请求数据
            //...reqData
            const res = await getBlogListAPI(reqData)
            if (res && res.data && res.data.data && res.data.data.results) {
                setBlogList(res.data.data.results)
            } else {
                // Handle the case where the data is not in the expected format
                console.error("Error: Unexpected response structure from getBlogListAPI", res);
                setBlogList([]); // Set to empty array or handle error appropriately
            }
            //console.log(res.data.data.results)
        }
        //调用函数
        getBlogList()
    }, [reqData])

    //3、搜索功能
    const onSearch = (value) => {
        //console.log(value)
        setReqData({
            ...reqData,
            account2: value
        })
        //reqData依赖项发生变化，重复执行副作用函数
    }

    //4、状态标签
    const status = {
        0: <Tag color="warning">未发布</Tag>,
        1: <Tag color="success">已发布</Tag>
    }

    // 确认发布
    const [showPublishResult, setshowPublishResult] = useState(false)

    const handlePublishResultCancel = () => {
        //关闭对话框时刷新blog列表
        setReqData({ ...reqData })
        setshowPublishResult(false)
    }

    const onPublishConfirm = async (blogId) => {
        const res = await publishBlogAPI(blogId)
        console.log(res)
        setshowPublishResult(true)
    }

    // 确认删除
    const [showDeleteResult, setshowDeleteResult] = useState(false)

    const handleDeleteResultCancel = () => {
        //关闭对话框时刷新blog列表
        setReqData({ ...reqData })
        setshowDeleteResult(false)
    }

    const onDeletConfirm = async (blogId) => {
        const res = await deleteBlogAPI(blogId)
        console.log(res)
        setshowDeleteResult(true)
    }

    // 确认下架
    const [showRevokeResult, setshowRevokeResult] = useState(false)

    const handleRevokeResultCancel = () => {
        //关闭对话框时刷新blog列表
        setReqData({ ...reqData })
        setshowRevokeResult(false)
    }

    const onRevokeConfirm = async (blogId) => {
        const res = await revokeBlogAPI(blogId)
        console.log(res)
        setshowRevokeResult(true)
    }


    const columns = [

        {
            title: '内容标题',
            dataIndex: 'title',
            width: 260
        },
        {
            title: '正文',
            dataIndex: 'content',
            width: 900,
            render: (data) => {
                return <div dangerouslySetInnerHTML={{ __html: data }} />
            }
        },
        {
            title: '内容状态',
            dataIndex: 'status',
            width: 100,
            // data - 后端返回的状态status 根据它做条件渲染
            // render - 自定义渲染函数
            // data 0:未发布 1:已发布
            render: data => status[data]
        },
        {
            title: '账号',
            dataIndex: 'account',
            width: 150
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        {data.status === 0 ?
                            <Tooltip title="发布blog">
                                <Popconfirm
                                    title="发布Blog"
                                    description="确认要发布该条Blog吗?"
                                    okText="Yes"
                                    cancelText="No"
                                    onConfirm={() => onPublishConfirm(data.id)}
                                >
                                    <Button id="publish-button" type="primary" shape="circle" icon={<ExportOutlined />} />
                                </Popconfirm>
                            </Tooltip> : null}

                        {(data.status === 1 && (<Tooltip title="下架blog">
                            <Popconfirm
                                title="下架blog"
                                description="确认要下架该条blog吗?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => onRevokeConfirm(data.id)}
                            >
                                <Button
                                    id="revoke-button"
                                    type="primary"
                                    danger
                                    shape="circle"
                                    icon={<ImportOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>))}


                        <Tooltip title="编辑blog">
                            <Button onClick={() => navigate(`/layout/publish?id=${data.id}`)} type="primary" shape="circle" icon={<EditOutlined />} />
                        </Tooltip>

                        <Tooltip title="删除blog">
                            <Popconfirm
                                title="删除blog"
                                description="确认要删除该条blog吗?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => onDeletConfirm(data.id)}
                            >
                                <Button
                                    type="primary"
                                    danger
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        </Tooltip>
                    </Space>
                )
            }
        }
    ]

    const navigate = useNavigate()
    //发布blog
    const publishBlog = () => {
        navigate('/layout/publish')
    }

    return (
        <div>
            <Card title={<Breadcrumb separator=">">
                <Breadcrumb.Item>
                    <Link to="/layout">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>内容管理</Breadcrumb.Item>
            </Breadcrumb>}>

                <Search onSearch={onSearch} placeholder="输入账号搜索" style={{ width: 300 }} />

                <Button type='primary' onClick={publishBlog} htmlType="button" style={{ float: "right" }}>
                    新建Blog
                </Button>

            </Card>
            {/* 表格区域 */}
            <Card title={'内容'}>
                <Table className="custom-table" rowKey="id" columns={columns} dataSource={blogList}
                />
            </Card>
            <Modal
                title="发布提示"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showPublishResult}
                onCancel={handlePublishResultCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handlePublishResultCancel}>
                        确认
                    </Button>
                ]}>
                <p>您的Blog已发布！</p>
            </Modal>

            <Modal
                title="删除提示"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showDeleteResult}
                onCancel={handleDeleteResultCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleDeleteResultCancel}>
                        确认
                    </Button>
                ]}>
                <p>Blog删除成功！</p>
            </Modal>

            <Modal
                title="下架提示"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showRevokeResult}
                onCancel={handleRevokeResultCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleRevokeResultCancel}>
                        确认
                    </Button>
                ]}>
                <p>Blog下架成功！</p>
            </Modal>
        </div>
    )

}

export default ContentManager;