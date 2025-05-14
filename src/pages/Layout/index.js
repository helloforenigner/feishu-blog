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
  const userInfo = useSelector(state => state.user.userInfo)
  const name = userInfo.name
  // 优先从 localStorage 读取 role（本地模拟登录），否则用 redux
  let role = localStorage.getItem('userRole')
  if (role === null || role === undefined) {
    role = userInfo.role
  } else {
    // 兼容字符串/数字
    role = Number(role)
  }

  // 菜单项定义
  const menuItems = [
    {
      icon: <HomeOutlined />,
      key: '/layout',
      label: '内容管理'
    }
  ]
  if (role === 1) {
    menuItems.push(
      {
        icon: <DiffOutlined />,
        key: '/layout/accountManager',
        label: '账号管理'
      },
      {
        icon: <EditOutlined />,
        key: '/layout/abnormalDetect',
        label: '异常感知'
      }
    )
  }

  return (
    <Layout>
      <Header className="header">
        <div className='title'>Blog管理系统</div>
        <div className="logo" />
        <div className="user-info">
          {role === 0 && (
            <button
              className="back-home-btn"
              style={{ marginRight: 16, padding: '4px 12px', borderRadius: 6, border: 'none', background: '#409EFF', color: '#fff', cursor: 'pointer', fontSize: 14 }}
              onClick={() => navigate('/home')}
            >
              返回首页
            </button>
          )}
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
            items={menuItems}
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

