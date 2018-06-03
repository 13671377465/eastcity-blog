import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link} from 'react-router-dom'
import { Form, Input, DatePicker, Col, TimePicker, Select, Cascader, InputNumber, message, Icon, Upload, Button, Modal } from 'antd'
import Fun from '../common/Common'

const FormItem = Form.Item
const { TextArea } = Input

class PlatformAbout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            aboutText: ''
        }
        this.aboutid = ''
    }

    submitHandle(event) {
        const self = this
        event.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(`/api/updateabout`, {
                    method: 'post',
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: `abouttext=${values['abouttext']}`
                })
                .then(res => res.json())
                .then(data => {
                    data['status'] ? Fun.successMes('介绍页修改成功') : Fun.errorMes('介绍页修改失败')

                    self.setState({
                        redirect: data['status']
                    })
                }) 
                .catch(error => { 
                    Fun.errorMes('网络出错了，修改失败')
                    console.log(error)
                })
            }
        })
    }

    componentDidMount() {
        const self = this
        fetch(`/api/getabout`)
        .then(res => res.json())
        .then(data => {
            return self.setState({
                aboutText: data['about'][0]['abouttext'],
            })
        }) 
        .catch(error => {
            Fun.errorMes('网络出错了，请稍后访问')
            console.log(error)
        })
    }

    render() {
        const { aboutText, redirect } = this.state
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
        if( redirect ) {
            return <Redirect to='/platform' />
        }
        return (
            <Form className="content-padding" hideRequiredMark={true} onSubmit={(...args) => this.submitHandle(...args)}>
                <FormItem 
                    {...formItemLayout} 
                    label="正文"
                >
                    {getFieldDecorator('abouttext', {
                        rules: [{
                        required: true,
                        message: '正文不能为空',
                        }],
                        initialValue: aboutText
                    })(
                        <TextArea 
                            placeholder="随便写点儿什么" 
                            rows={10}
                            name="abouttext"
                            maxLength={50000}
                        />
                    )}
                </FormItem>
                <FormItem className="form-button-group">
                    <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(PlatformAbout)