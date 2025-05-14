import { Card, Breadcrumb, Form, Tag, Button, Table, Space, Popconfirm, DatePicker, Tooltip, Modal, Descriptions } from 'antd';
import { data, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAccountDetailAPI } from '@/apis/account'
import { getAbnormalListAPI, getAbnormalDetailAPI } from '@/apis/abnormal';
import UserInfo from '@/components/UserInfo'
//引入汉化包 时间选择器显式中文
import locale from 'antd/es/date-picker/locale/zh_CN'

import './index.scss'

const { RangePicker } = DatePicker;

const AbnormalDetect = () => {


    //1、准备请求参数
    const [reqData, setReqData] = useState({
        page: 1,
        per_page: 10
    })

    //2、获取异常信息列表
    const [abnormalList, setAbnormalList] = useState([])

    useEffect(() => {
        //定义获取异常信息列表的函数
        const getAbnormalList = async () => {
            //请求数据
            //...reqData
            const res = await getAbnormalListAPI(reqData)
            setAbnormalList(res.data.data.results)
            //console.log(res.data.data.results)
        }
        //调用函数
        getAbnormalList()
    }, [reqData])

    //3、搜索功能
    const onFinish = (values) => {
        //console.log(values)
        setReqData({
            ...reqData,
            begin_date: values.date ? values.date[0].format('YYYY-MM-DD') : '',
            end_date: values.date ? values.date[1].format('YYYY-MM-DD') : ''
        })
        //reqData依赖项发生变化，重复执行副作用函数
    }

    // 状态标签
    const status = {
        0: <Tag color="warning">未登录</Tag>,
        1: <Tag color="success">已登录</Tag>,
        2: <Tag color="error">已封禁</Tag>
    }


    //5、查看账号详情
    const [accountModalOpen, setAccountModalOpen] = useState(false);
    const [accountInfo, setAccountInfo] = useState({})

    const handleAccountModalCancel = () => {
        setAccountModalOpen(false);
    };

    const accountItems = [
        {
            key: '1',
            label: '账号',
            children: accountInfo.account,
            span: 1.5
        },
        {
            key: '2',
            label: '昵称',
            children: accountInfo.username,
            span: 1.5
        },
        {
            key: '3',
            label: '手机号',
            children: accountInfo.phone,
            span: 1.5
        },
        {
            key: '4',
            label: '账号状态',
            children: status[accountInfo.status],
            span: 1.5
        },
        {
            key: '5',
            label: '账号创建时间',
            children: accountInfo.createdAt,
            span: 3
        },
        {
            key: '6',
            label: '账号变更时间',
            children: accountInfo.updatedAt,
            span: 3
        },
        {
            key: '7',
            label: '用户简介',
            children: accountInfo.profile,
        }
    ];


    const showAccountDetail = async (account) => {
        const res = await getAccountDetailAPI(account)
        console.log(res)
        setAccountInfo(res.data.data)
        setAccountModalOpen(true);

        //console.log('查看账号详情')
    }

    // 查看异常详情
    const [abnormalModalOpen, setAbnormalModalOpen] = useState(false);
    const [abnormalInfo, setAbnormalInfo] = useState({})

    const handleAbnormalModalCancel = () => {
        setAbnormalModalOpen(false);
    };


    const annormalItems = [
        {
            key: '1',
            label: '账号',
            children: abnormalInfo.account,
            span: 1.5
        },
        {
            key: '2',
            label: '发布时间',
            children: abnormalInfo.publish_time,
            span: 1.5
        },
        {
            key: '3',
            label: '标题',
            children: abnormalInfo.title,
            span: 3
        },
        {
            key: '4',
            label: '异常描述',
            children: abnormalInfo.description,
            span: 3
        },
        {
            key: '5',
            label: '详细异常信息',
            children: abnormalInfo.detail,
            span: 3
        },
        {
            key: '6',
            label: '正文',
            children: abnormalInfo.content,

        }
    ];

    const showAbnormalDetail = async (id) => {
        const res = await getAbnormalDetailAPI(id)
        console.log(res)
        setAbnormalInfo(res.data.data)
        setAbnormalModalOpen(true);

        //console.log('查看账号详情')
    }


    // 用户管理操作
    const [showOperateResult, setShowOperateResult] = useState(false);
    const handleOperateResultCancel = () => {
        setShowOperateResult(false)
    }

    const onOperateConfirm = (account, operation) => {
        console.log(account, operation)
        setShowOperateResult(true)
    }


    const columns = [

        {
            title: '账号',
            dataIndex: 'account',
            width: 220,
            render: (text) => {
                return (
                    <Tooltip title="点击查看账号详情">
                        <p onClick={() => showAccountDetail(text)} className='account-text'>{text}</p>
                    </Tooltip>
                )
            }
        },
        {
            title: '异常原因',
            width: 220,
            render: data => {
                return (
                    <Tooltip title="点击查看异常详情">
                        <p onClick={() => showAbnormalDetail(data.id)} className='description-text'>{data.description}</p>
                    </Tooltip>
                )
            }
        },
        {
            title: '账号状态',
            dataIndex: 'status',
            width: 220,
            render: data => status[data]
        },
        {
            title: '发布时间',
            dataIndex: 'publish_time',
            width: 220

        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle" className='operate-space'>
                        {/* 条件渲染，已登录状态的用户才能进行踢蹬 */}
                        {(data.status === 1) && (
                            <Popconfirm
                                title="踢蹬用户"
                                description="确认要踢蹬该用户吗?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => onOperateConfirm(data.account, 2)}
                            >
                                <Button className="kick_out-button" shape="circle">踢蹬</Button>
                            </Popconfirm>)
                        }
                        {/* 条件渲染，已封禁状态的用户才能进行解封 */}
                        {(data.status === 2) && (
                            <Popconfirm
                                title="解封用户"
                                description="确认要解封该用户吗?"
                                okText="Yes"
                                cancelText="No"
                                onConfirm={() => onOperateConfirm(data.account, 0)}
                            >
                                <Button className="revive-button" shape="circle">解封</Button>
                            </Popconfirm>
                        )}
                        {/* 条件渲染，已登录和未登录状态的用户才能进行封禁 */}
                        {(data.status === 0 || data.status === 1) && (<Popconfirm
                            title="封禁用户"
                            description="确认要封禁该用户吗?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => onOperateConfirm(data.account, 1)}
                        >
                            <Button
                                className="prohibit-button"
                                shape="circle"
                            >封禁</Button>
                        </Popconfirm>)}

                    </Space>
                )
            }
        }
    ]
    return (
        <div>
            <Card title={<Breadcrumb separator=">">
                <Breadcrumb.Item>
                    <Link to="/layout">首页</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>异常感知</Breadcrumb.Item>
            </Breadcrumb>}>
                <Form layout='inline' onFinish={onFinish}>
                    <Form.Item label="日期" name="date">
                        {/* 传入locale属性 控制中文显示*/}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
                            查询
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            {/* 表格区域 */}
            <Card>
                <Table rowKey="id" columns={columns} dataSource={abnormalList}
                />
            </Card>

            <UserInfo open={accountModalOpen} onCancel={handleAccountModalCancel} items={accountItems} />

            <Modal
                title="异常详情"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={abnormalModalOpen}
                onCancel={handleAbnormalModalCancel}
                footer={null}
                width={{
                    xs: '80%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '40%',
                }}>
                <Descriptions bordered items={annormalItems} />
            </Modal>

            <Modal
                title="操作提示"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={showOperateResult}
                onCancel={handleOperateResultCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleOperateResultCancel}>
                        确认
                    </Button>
                ]}>
                <p>操作成功！</p>
            </Modal>
        </div>
    )
}

export default AbnormalDetect;