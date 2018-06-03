import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link } from 'react-router-dom'
import { Table, Icon, Button, Modal, message } from 'antd'
import Fun from '../common/Common'

const confirm = Modal.confirm

export default class PlatformBlog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            data: []
        }
    }

    getViewData = (data) => {
        return data['blogs'].map((blog, key) => {
            return {
                key: key,
                id: blog['id'],
                author: blog['author'],
                date: blog['date'],
                title: blog['title'],
                operate: blog['id'],
                tags: blog['tags'].split(',').map(tag=> {
                    let tg = data['tags'].find((tagname) => {
                        return tagname['id'] === tag
                    })
                    if(tg) return tg['value']
                }).join(' ')
            }
        })
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys })
    }

    showConfirm() {
        const self = this
        confirm({
            title: `警告`,
            content: `确定要删除选中项吗?`,
            onOk() {
                self.deleteBlog()
            }
        })
    }

    deleteBlog() {
        const { selectedRowKeys, data } = this.state
        const self = this
        const selectData = selectedRowKeys.map((value, index) => {
            return data[value]['operate']
        }).join(',')

        fetch(`/api/deleteblog`, {
            method: 'post', 
            headers: { 
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            body: `blogid=${selectData}`
        })
        .then(res => res.json())
        .then(datas => {
            if(datas['status'] === 'success') {
                Fun.successMes('博客删除成功')
                self.setState({
                    data: Fun.deleteSomeObj('key', selectedRowKeys, data),
                    selectedRowKeys: []
                })
            } else {
                Fun.errorMes('博客删除失败')
            }
        })
        .catch(error => {
            Fun.errorMes('网络错误，博客删除失败，请重试')
            console.log('Request failed', error)
        })
    }

    componentDidMount() {
        const self = this
        fetch(`/api/getblogandtag?tagid=0`)
        .then(res => res.json())
        .then(data => {
            return self.setState({
                data: self.getViewData(data)
            })
        }) 
        .catch(error => {
            console.log('Request failed', error)
        })
    }

    render() {
        const { selectedRowKeys, data, isDelete } = this.state
        const matchPath = this.props.match.path
        const hasSelected = selectedRowKeys.length > 0
        const columns = [{
            title: '标题',
            width: '25%',
            dataIndex: 'title'
        }, {
            title: '标签',
            width: '25%',
            dataIndex: 'tags',
        }, {
            title: '时间',
            width: '20%',
            dataIndex: 'date'
        }, {
            title: '作者',
            width: '15%',
            dataIndex: 'author'
        }, {
            title: '操作',
            width: '15%',
            dataIndex: 'operate',
            render(text) {
                return ( 
                    <span>
                    <Link to={`${matchPath}/update/${text}`}>
                        <Icon type="file" style={{ fontSize: 16, color: '#08c' }} />
                    </Link>
                    </span>
                )
            }
        }]

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }

        const pagination = {
            total: data.length,
            showSizeChanger: true,
        }

        return (
            <div className="content-padding">
                <div className="button-group">
                    <Button
                        type="primary"
                        onClick={ () => this.props.history.push(`${matchPath}/create`) }
                    >
                    新建
                    </Button>
                    {
                        hasSelected ? (
                            <Button
                                onClick={ () => this.showConfirm() }
                            >
                            删除
                            </Button>
                        ) : null
                    }
                    
                </div>
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} bordered pagination={pagination} className="blogtable-zindex" />
            </div>
        )
    }
}