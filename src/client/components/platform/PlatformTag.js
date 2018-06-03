import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link} from 'react-router-dom'
import { Row, Table, Icon, Card, List, Button, Form, Input, Modal, message } from 'antd'
import Fun from '../common/Common'

const { Meta } = Card
const FormItem = Form.Item
const confirm = Modal.confirm

export default class PlatformTag extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            isNewTag: false,
            isEdit: 0,
        }
    }

    createNewTag() {
        this.setState({
            isNewTag: true
        })
    }

    cancelNewTag() {
        this.setState({
            isNewTag: false
        })
    }

    cancelEditTag() {
        this.setState({
            isEdit: 0
        })
    }

    submitHandle(event) {
        const self = this
        event.preventDefault()
        const target = event.target
        const atg = target[0]['value'].split(':')
        const name = atg[0]
        const count = atg[1]
        fetch(`/api/createtag`, { 
            method: 'post', 
            headers: { 
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            body: `tagname=${name}&tagcount=${count}`
        })
        .then(res => res.json())
        .then(data => {
            Fun.successMes('标签创建成功')
            self.setState({
                data: data['tags'],
                isNewTag: false
            })
        }) 
        .catch(error => { 
            Fun.errorMes('标签创建失败')
            console.log(error)
        })
    }

    editHandle(item, event) {
        const self = this
        event.preventDefault()
        const target = event.target
        const atg = target[0]['value'].split(':')
        const name = atg[0]
        const count = atg[1]
        fetch(`/api/updatetag`, {
            method: 'post', 
            headers: { 
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            body: `tagid=${item.id}&tagname=${name}&tagcount=${count}`
        })
        .then(res => res.json())
        .then(data => {
            Fun.successMes('标签修改成功')
            self.setState({
                data: data['tags'],
                isEdit: 0
            })
        }) 
        .catch(error => { 
            Fun.errorMes('标签修改失败')
            console.log(error)
        })
    }

    showConfirm(item) {
        const self = this
        confirm({
            title: `警告`,
            content: `确定要删除${item.value}?`,
            onOk() {
                self.deletetag(item.id)
            }
        })
    }

    deletetag = (id) => {
        const self = this
        fetch(`/api/deletetag`, {
            method: 'post', 
            headers: { 
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            body: `tagid=${id}`
        })
        .then(res => res.json())
        .then(data => {
            Fun.successMes('标签删除成功')
            self.setState({
                data: data['tags'],
            })
        }) 
        .catch(error => { 
            Fun.errorMes('标签删除失败')
            console.log(error)
        })
    }

    editTag(index) {
        this.setState({
            isEdit: index
        })
    }

    componentDidMount() {
        const self = this
        fetch(`/api/gettag`)
        .then(res => res.json())
        .then(data => {
            let d = data['tags']
            d.unshift({
                value:'新建标签'
            })
            return self.setState({
                data: d
            })
        })
        .catch(error => {
            console.log(error)
        })
    }

    render() {
        const { isEdit, isNewTag, data } = this.state

        let content
        if( isNewTag ) {
            content = (
                <Form onSubmit={ (...args) => this.submitHandle(...args) } className='tagForm'>
                    <Icon type='close' className='tagClose' onClick={ () => this.cancelNewTag() }/>
                    <FormItem>
                        <Input prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="标签名" name="tagname"/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                            创建
                        </Button>
                    </FormItem>
                </Form>
            )
        } else {
            content = (
                <Button type='dashed' className='tagButton' onClick={ () => this.createNewTag() }>
                    <Icon type='plus' />
                    <span>新建标签</span>
                </Button>
            )
        }
        return (
            <List
                split = {false}
                grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
                dataSource={ data }
                className='body-tag'
                renderItem={( item, index ) => {
                    if( index === 0 ) {
                        return (
                            <List.Item>
                                { content }
                            </List.Item>
                        )
                    } else {
                        if( index === isEdit ) {
                            const dv = `${item.value}:${item.count}`
                            return (
                                <List.Item>
                                    <Form onSubmit={ (...args) => this.editHandle(item, ...args) } className='tagForm'>
                                        <Icon type='rollback' className='tagClose' onClick={ () => this.cancelEditTag() }/>
                                        <FormItem>
                                            <Input 
                                                prefix={<Icon type="tag" style={{ color: 'rgba(0,0,0,.25)' }} />} 
                                                placeholder="标签名" 
                                                name="tagname" 
                                                defaultValue={ dv }
                                                maxLength={20}
                                            />
                                        </FormItem>
                                        <FormItem>
                                            <Button type="primary" htmlType="submit">
                                                修改
                                            </Button>
                                        </FormItem>
                                    </Form>
                                </List.Item>
                            )
                        } else {
                            return (
                                <List.Item>
                                    <Card
                                        actions = {[ <Icon type='edit' onClick={() => this.editTag(index)}/>, <Icon type='delete' onClick={() => this.showConfirm(item)} /> ]}
                                    >
                                        <Meta
                                            title = { item.value }
                                            description = {`权重：${ item.count }`}
                                        />
                                    </Card>
                                </List.Item>
                            )
                        }
                    }
                }
            }
            >
            </List>
        )
    }
}