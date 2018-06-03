import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link} from 'react-router-dom'
import { Form, Input, DatePicker, Col, TimePicker, Select, Cascader, InputNumber, message, Icon, Upload, Button, Modal } from 'antd'
import Fun from '../common/Common'

const FormItem = Form.Item
const { TextArea } = Input

class PlatformSetting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            redirect: false,
            oldType: true,
            oldShow: false,
            newType: true,
            newShow: false
        }
    }

    onChangeShow = (e) => {
        if( e.target.value === null || e.target.value.length === 0 ) {
            e.target['name'] === 'oldpassword' ? this.setState({ oldShow:  false}) : this.setState({ newShow:  false})
        } else {
            e.target['name'] === 'oldpassword' ? this.setState({ oldShow:  true}) : this.setState({ newShow:  true})
        }
    }

    submitHandle(event) {
        const self = this
        event.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(`/api/updatepassword`, {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: `oldpassword=${values['oldpassword']}&newpassword=${values['newpassword']}`
                })
                .then(res => res.json())
                .then(data => {
                    data['status'] ? Fun.successMes('密码修改成功') : Fun.errorMes('密码修改失败')

                    self.setState({
                        redirect: data['status']
                    })
                }) 
                .catch(function (error) {
                    self.error('密码修改失败')
                    console.log(error)
                })
            }
        })
    }

    render() {
        const { redirect, oldType, oldShow, newType, newShow } = this.state
        const oType = oldType ? 'password' : 'text'
        const nType = newType ? 'password' : 'text'
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        }
        const oldSuffix = oldShow ? <Icon className="icon-middle" type={this.state.oldType?'eye-o':'eye'} onClick={()=>this.setState({oldType: !oldType})} /> : null
        const newSuffix = newShow ? <Icon className="icon-middle" type={this.state.newType?'eye-o':'eye'} onClick={()=>this.setState({newType: !newType})} /> : null
        if( redirect ) {
            return <Redirect to='/platform' />
        }
        return (
            <Form className="content-padding" hideRequiredMark={true} onSubmit={(...args) => this.submitHandle(...args)}>
                <FormItem {...formItemLayout} label="旧密码">
                    {getFieldDecorator('oldpassword', {
                        rules: [{
                        required: true,
                        message: '旧密码不能为空',
                        }]
                    })(
                        <Input 
                            placeholder="请输入旧密码" 
                            name="oldpassword" 
                            type={oType}
                            suffix={oldSuffix}
                            onChange={this.onChangeShow}
                            maxLength={15}
                        />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('newpassword', {
                        rules: [{
                        required: true,
                        message: '新密码不能为空',
                        }]
                    })(
                        <Input 
                            placeholder="请输入新密码" 
                            name="newpassword" 
                            type={nType}
                            suffix={newSuffix}
                            onChange={this.onChangeShow}
                            maxLength={15}
                        />
                    )}
                </FormItem>
                <FormItem className="form-button-group">
                    <Button type="primary" htmlType="submit">修改</Button>
                    <Button onClick={()=>this.setState({redirect: true})}>取消</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(PlatformSetting)