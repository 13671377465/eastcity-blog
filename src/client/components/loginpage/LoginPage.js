import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link} from 'react-router-dom'
import { Layout, Menu, Breadcrumb, Form, Icon, Input, Button, Checkbox, Alert, message } from 'antd'
import Fun from '../common/Common'
import 'whatwg-fetch'
import './loginpage-css.scss'

const { Header, Content, Footer, Sider } = Layout
const FormItem = Form.Item

class SubmitForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            redirectToReferrer: false,
            alertVisiable: false,
            type: true,
            show: false
        }
    }

    closeAlertHandle = () => {
        this.setState({ alertVisiable: false })
    }

    showAlertHandle = () => {
        this.setState({ alertVisiable: true })
    }

    onChangeShow = (e) => {
        if( e.target.value === null || e.target.value.length === 0 ) {
            this.setState({ show:  false})
        } else {
            this.setState({ show:  true})
        }
    }

    submitHandle = event => {
        event.preventDefault()
        const self = this
        this.props.form.validateFields((err, values) => {
            fetch(`/api/login`, {
                method: 'post', 
                headers: { 
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
                }, 
                body: `username=${values['username']}&password=${values['password']}`,
                credentials: 'same-origin'
            })
            .then(res => res.json())
            .then(data => {
                if( data['status'] === 'success' ) {
                    Fun.successMes('登录成功')
                    return self.setState({ redirectToReferrer: true })
                } else {
                    return self.showAlertHandle()
                }
            }) 
            .catch(error => {
                Fun.errorMes('登录失败，可能为网络错误')
            })
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { redirectToReferrer, type, show } = this.state
        const suffix = show ? <Icon className="icon-middle" type={type?'eye-o':'eye'} onClick={()=>this.setState({type: !type})} /> : null
        
        if (redirectToReferrer) {
            return <Redirect to='/platform' />
        }
        
        return (
            <Layout className='login-page'>
                <Header className='login-header'>
                    <h1>EC blog</h1>
                    <h2>欢迎登录</h2>
                </Header>
                <Content className='login-content'>
                    <Form onSubmit={this.submitHandle} className="login-form">
                        {
                            this.state.alertVisiable ? (
                                <Alert
                                    className = 'errorAlert'
                                    message = '用户名或密码错误，请重新输入'
                                    type = 'error'
                                    closable
                                    afterClose = { () => this.closeAlertHandle() }
                                />
                            ) : null
                        }
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" name="username"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码!' }],
                            })(
                                <Input 
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                                    type={type?'password':'text'} 
                                    placeholder="密码" 
                                    name="password"
                                    suffix={suffix}
                                    onChange={this.onChangeShow}
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </FormItem>
                    </Form>
                </Content>
                <Footer className='login-footer'>EC blog ©2018 Created by EastCity</Footer>
            </Layout>
        )
      }
}
export default Form.create()(SubmitForm)