import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect, withRouter, Link} from 'react-router-dom'
import { Form, Input, DatePicker, Col, TimePicker, Select, Cascader, InputNumber, message, Icon, Upload, Button, Modal } from 'antd';
import * as qiniu from 'qiniu-js'
import Fun from '../common/Common'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
  
class BlogForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList: [],
            selectLimit: false,
            token: '',
            blogs: [],
            tags: [],
            checkImage: true,
            redirect: false
        }
        this.selectList = []
        this.BASE_WEBSITE = "http://p3d0pinbj.bkt.clouddn.com/"
        this.SERVER_WEBSITE = "http://upload-z1.qiniup.com"
    }

    uploadCancelHandle() {
        this.setState({ previewVisible: false })
    }

    previewHandle(file) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        })
    }
      
    beforeUpload(file) {
        const isLim = file.size / 1024 / 1024 < 5
        if (!isLim) {
             message.error('上传文件大小错误：上传的图片请不要大于5M')
        }
        return isLim
    }

    uploadRemoveHandle() {
        this.setState({
            fileList: [],
            checkImage: true
        })
        return true
    }
    
    uploadHandle({ file, fileList }) {
        const {uid, name, type, thumbUrl, status, response = {}} = file
        const fileItem = {
            uid,
            name,
            type,
            thumbUrl,
            status,
            url: this.BASE_WEBSITE + (response.hash || '')
        }
        fileList.pop()
        fileList.push(fileItem)
        this.ImageUrl = fileItem['url']
        this.setState({
            fileList: fileList,
            checkImage: true
        })
    }

    checkSelect( value ) {
        this.selectList = value
        if(value.length > 2){
            this.setState({
                selectLimit: true
            })
        }else{
            this.setState({
                selectLimit: false
            })
        }
    }

    toBlogList() {
        this.setState({
            redirect: true
        })
    }

    submitHandle(event) {
        const blogid = this.props.match.params['articleid']
        const api = blogid ? `/api/updateblog` : `/api/createblog`
        const self = this
        const target = event.target
        event.preventDefault()
        this.props.form.validateFields((err, blog) => {
            if (!err) {
                blog['tags'] = blog['tags'].join(',')
                blog['picture'] = self.ImageUrl
                fetch(api, {
                    method: 'post', 
                    headers: {
                        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: `blogid=${blogid}&blogtitle=${blog['title']}&blogsubtitle=${blog['subtitle']}&blogauthor=${blog['author']}&blogsummary=${blog['summary']}&blogfulltext=${blog['fulltext']}&blogpicture=${blog['picture']}&blogtags=${blog['tags']}`
                })
                .then(res => res.json())
                .then(data => {
                    if(data['status'] === 'success') {
                        Fun.successMes('博客提交成功')
                        self.toBlogList()
                    } else {
                        Fun.errorMes('博客提交失败')
                    }
                    
                }) 
                .catch(error => {
                    Fun.errorMes('网络错误，博客提交失败，请重试')
                })
            }
        })
    }

    componentDidMount() {
        const articleid = this.props.match.params['articleid']
        const self = this
        fetch(`/api/gettoken`, {
            method: 'post',
            headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" 
            },
            body: `blogid=${articleid}`
        })
        .then(res => res.json())
        .then(data => {
            let image = []
            let check = true
            if ( data['blogs'].length ) {
                image.push({
                    uid: '-1',
                    name: 'xxx.png',
                    status: 'done',
                    response: '{"status": "success"}',
                    url: data['blogs'][0]['picture']
                })
                self.ImageUrl = data['blogs'][0]['picture']
                check = false
            }
            self.setState({
                token: data['uptoken'],
                blogs: data['blogs'],
                tags: data['tags'],
                fileList: image,
                checkImage: check
            })
        }) 
        .catch(error => { 
            return
        })
    }

    render() {
        const { previewVisible, previewImage, loading, fileList, selectLimit, token, blogs, tags, checkImage, redirect } = this.state
        const matchPath = this.props.match.path
        const { getFieldDecorator } = this.props.form

        if(redirect) {
            return <Redirect to="/platform/blog" />
        }

        const isBlog = blogs.length !== 0
        const 
            initTitle = isBlog ? blogs[0]['title'] : '',
            initSubtitle = isBlog ? blogs[0]['subtitle'] : '',
            initAuthor = isBlog ? blogs[0]['author'] : '',
            initSummary = isBlog ? blogs[0]['summary'] : '',
            initFulltext = isBlog ? blogs[0]['fulltext'] : '',
            initTags = isBlog ? blogs[0]['tags'].split(',') : []

        const selectOption = tags.map(( tag, index) => {
            let sl = !this.selectList.includes(tag.id) ? selectLimit : false
            return <Option value={tag.id} key={index} disabled={sl}>{tag.value}</Option>
        })
        const uploadButton = (
            <div>
              <Icon type='plus' />
              <div className="ant-upload-text">上传</div>
            </div>
        )
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
        const uploadProps = {
            accept: "iamge/*",
            action: this.SERVER_WEBSITE,
            data: {
                token
            },
            name: "file",
            listType: 'picture-card',
            fileList: fileList
        }
        
        return (
            <Form className="content-padding" hideRequiredMark={true} onSubmit={(...args) => this.submitHandle(...args)}>
                <FormItem {...formItemLayout} label="标题">
                    {getFieldDecorator('title', {
                        rules: [{
                        required: true,
                        message: '文章标题不能为空',
                        }],
                        initialValue: initTitle
                    })(
                        <Input placeholder="请输入文章标题" name="title" maxLength={20} />
                    )}
                </FormItem>
        
                <FormItem {...formItemLayout} label="副标题">
                    {getFieldDecorator('subtitle', {
                        rules: [{
                        required: true,
                        message: '文章副标题不能为空',
                        }],
                        initialValue: initSubtitle
                    })(
                        <Input placeholder="请输入文章副标题" name="subtitle" maxLength={20} />
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="作者">
                    {getFieldDecorator('author', {
                        rules: [{
                        required: true,
                        message: '文章作者不能为空',
                        }],
                        initialValue: initAuthor
                    })(
                        <Input placeholder="请输入文章作者" name="author" maxLength={20} />
                    )}
                </FormItem>
        
                <FormItem
                    {...formItemLayout}
                    label="标签"
                    hasFeedback
                >
                    {getFieldDecorator('tags', {
                        rules: [
                            { 
                                required: true, 
                                message: '请至少选择一个标签'
                            },
                        ],
                        initialValue: initTags
                    })(
                    <Select 
                        mode="multiple"
                        placeholder="请选择标签"
                        onChange={(...args)=>this.checkSelect(...args)}
                        name="tags"
                    >
                        { selectOption }
                    </Select>
                    )}
                </FormItem>
        
                <FormItem
                    {...formItemLayout}
                    label="封面"
                    >
                    {getFieldDecorator('picture', {
                        rules: [
                            {
                                required: checkImage, 
                                message: '封面不能为空'
                            },
                        ],
                        defaultFileList: fileList
                    })(
                        <div>
                        <Upload 
                            {...uploadProps}
                            beforeUpload={(...args)=>this.beforeUpload(...args)}
                            onPreview={(...args)=>this.previewHandle(...args)}
                            onChange={(...args)=>this.uploadHandle(...args)}
                            onRemove={()=>this.uploadRemoveHandle()}
                        >
                            {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal visible={previewVisible} footer={null} onCancel={()=>this.uploadCancelHandle()}>
                            <img alt="封面" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                        </div>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="摘要"
                    >
                    {getFieldDecorator('summary', {
                        rules: [
                            {
                                required: true, 
                                message: '文章摘要不能为空' 
                            },
                        ],
                        initialValue: initSummary
                    })(
                        <TextArea 
                            placeholder="写作一段展示在首页卡片里的文章摘要" 
                            autosize={{ minRows: 2, maxRows: 6 }} 
                            name="summary"
                            maxLength={150}
                        />
                    )}
                </FormItem>

                <FormItem 
                    {...formItemLayout} 
                    label="正文"
                >
                    {getFieldDecorator('fulltext', {
                        rules: [{
                        required: true,
                        message: '正文不能为空',
                        }],
                        initialValue: initFulltext
                    })(
                        <TextArea 
                            placeholder="随便写点儿什么" 
                            rows={10}
                            name="fulltext"
                            maxLength={50000}
                        />
                    )}
                </FormItem>

                <FormItem className="form-button-group">
                    <Button type="primary" htmlType="submit">发表</Button>
                    <Button onClick={ () => this.toBlogList()}>取消</Button>
                </FormItem>
            </Form>
        )
    }
}

export default Form.create()(BlogForm)