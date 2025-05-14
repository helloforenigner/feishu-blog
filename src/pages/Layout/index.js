import { Layout, Menu, Popconfirm } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { Outlet } from 'react-router-dom'
import './index.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { fetchUserInfo, clearUserInfo } from '@/store/modules/user'

const { Header, Sider } = Layout
export const BlogLayout = () => {
  const navigate = useNavigate()
  const onMenuClick = (route) => {
    const path = route.key
    navigate(path)
  }

  //反向高亮
  //1.获取当前路由信息
  const location = useLocation()
  const selectedkey = location.pathname

  //触发用户个人信息action
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  //用户退出，返回登录页面
  const confirm = () => {
    dispatch(clearUserInfo())
    navigate('/')
  }

  //从redux中获取用户信息
  const name = useSelector(state => state.user.userInfo.name)
  return (
    <Layout>
      <Header className="header">
        <div className='title'>Blog管理系统</div>
        <div className="logo" />
        <div className="user-info">
          <span className="user-name"><Link to="/user-center">{name}</Link></span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消"
              onConfirm={confirm}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            onClick={onMenuClick}
            selectedKeys={selectedkey}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/layout">
              内容管理
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/layout/accountManager">
              账号管理
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/layout/abnormalDetect">
              异常感知
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

