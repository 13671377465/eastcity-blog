import React from 'react'
import { Link, Route, Redirect } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import 'whatwg-fetch'
import PlatformIndex from '../platform/PlatformIndex'
import PlatformBlog from '../platform/PlatformBlog'
import PlatformTag from '../platform/PlatformTag'
import PlatformAbout from '../platform/PlatformAbout'
import PlatformSetting from '../platform/PlatformSetting'
import BlogForm from '../blogform/BlogForm'
import Fun from '../common/Common'

const { Header, Sider, Footer, Content } = Layout
const SubMenu = Menu.SubMenu

export default class PlatformPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            collapsed: false,
            refferToLogin: false,
            name: ''
        }
    }

    onCollapse = (collapsed) => {
        this.setState({ collapsed })
    }

    signOut = () => {
        const self = this
        fetch(`/api/signout`, {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(res => res.json())
        .then(data => {
            return self.setState({
                refferToLogin: true
            })
        })
        .catch(error => {
            Fun.errorMes('网络可能出错了')
            return self.setState({
                refferToLogin: true
            })
        })
    }

    componentDidMount() {
        const self = this
        fetch(`/api/checklogin`, {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(res => res.json())
        .then(data => {
            if(data['status'] === 'success') {
                return self.setState({
                    name: data['name']
                })
            } else {
                Fun.warnMes('请重新登录')
                return self.setState({
                    refferToLogin: true
                })
            }
        })
        .catch(error => {
            Fun.errorMes('网络出错了，请重新登录')
            return self.setState({
                refferToLogin: true
            })
        })
    }

    render() {
        const { collapsed, refferToLogin, name } = this.state
        if( refferToLogin ) {
            return <Redirect to='/platformlogin' />
        }
        return (
            <Layout className='platform' style={{height: '100%'}}>
                <Sider
                className='sider'
                collapsible
                collapsed={collapsed}
                onCollapse={this.onCollapse}
                >
                    <img src="http://p3d0pinbj.bkt.clouddn.com/logo.png" className="platform-logo"/>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" className="sider-zindex">
                        <Menu.Item key="1">
                        <Link to={`${this.props.match.path}`}>
                            <Icon type="profile" />
                            <span>我的首页</span>
                        </Link>
                        </Menu.Item>
                        <SubMenu key="sub1" title={<span><Icon type="edit" /><span>我的博客</span></span>}>
                            <Menu.Item key="2"><Link to={`${this.props.match.path}/blog`}>博客管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" title={<span><Icon type="tag-o" /><span>博客标签</span></span>}>
                            <Menu.Item key="3"><Link to={`${this.props.match.path}/tag`}>标签管理</Link></Menu.Item>
                        </SubMenu>
                        <Menu.Item key="4">
                            <Link to={`${this.props.match.path}/about`}>
                                <Icon type="code" />
                                <span>编辑关于</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className={this.state.collapsed ? 'context context-less' : 'context context-more'}>
                    <Header className="header">
                        <Menu mode="horizontal" className='menu'>
                            <SubMenu title={<span><Icon type="user" />{ name }</span>}>
                                <Menu.Item key="set2">
                                        <div
                                            style={{height: '100%'}}
                                            onClick={() => this.props.history.push('/platform/setting')}
                                        >
                                        修改密码
                                        </div>
                                </Menu.Item>
                                <Menu.Item key="set1">
                                    <div
                                        style={{height: '100%'}}
                                        onClick={this.signOut}
                                    >
                                    退出登录
                                    </div>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                        </Header>
                        <Content className='content'>
                        <div className='content-body'>
                            <Route exact path={`${this.props.match.path}`} component={PlatformIndex} />
                            <Route exact path={`${this.props.match.path}/blog`} component={PlatformBlog} />
                            <Route path={`${this.props.match.path}/tag`} component={PlatformTag} />
                            <Route path={`${this.props.match.path}/about`} component={PlatformAbout} />
                            <Route path={`${this.props.match.path}/setting`} component={PlatformSetting} />
                            <Route path={`${this.props.match.path}/blog/create`} component={BlogForm}/>
                            <Route path={`${this.props.match.path}/blog/update/:articleid`} component={BlogForm}/>
                        </div>
                    </Content>
                    <Footer className='footer'>
                        EC blog ©2018 Created by EastCity
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}