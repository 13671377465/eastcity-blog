import React from 'react'
import { Button, Icon, BackTop } from 'antd'
import 'whatwg-fetch'
import './blogstage.scss'
import BlogCard from '../blogcard/BlogCard'
import Fun from '../common/Common'

export default class BlogStage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            limit: 10,
            data: []
        }
        this.scale = 10
    }

    getViewData = (data) => {
        return data['blogs'].map((blog, key) => {
            return {
                key: key,
                id: blog['id'],
                author: blog['author'],
                date: blog['date'],
                picture: blog['picture'],
                title: blog['title'],
                subtitle: blog['subtitle'],
                summary: blog['summary'],
                tags: blog['tags'].split(',').map(tag=> {
                    return {
                        tagid: tag,
                        tagname: data['tags'].filter((tagname) => {
                            return tagname['id'] === tag
                        })[0]['value']
                    }
                })
            }
        })
    }

    changeLimit = () => {
        const { limit, data } = this.state
        const newlen = this.scale + limit
        this.setState({
            limit: newlen > data.length ? data.length : newlen
        })
    }

    componentDidMount() {
        const self = this
        const tagid = this.props[0].match.params['tagid'] || '0'
        this.props.setUnderlineStatus(1)
        fetch(`/api/getblogandtag?tagid=${tagid}`)
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
        const { limit, data } = this.state

        this.initBlogs = data.slice(0, limit).map((value, index)=>{
            return (
                <BlogCard message={value} position={index} match={this.props[0]} key={index}/>
            )
        })

        return (
            <main className="blog-main">
                { this.initBlogs }
                {
                    limit < data.length ? (<div className="show-more"><Button type="primary" shape="circle" icon="arrow-down" onClick={this.changeLimit} /></div>) : null
                }
                <BackTop className="back-top"/>
            </main>
        )
    }
}