import React from 'react'
import { Link } from "react-router-dom"
import { Icon } from 'antd'
import './blogcard-web.scss'
import './blogcard-h5.scss'

const BlogCard = (props) => {
    const position = props.position%2 === 0 ? "blog-card alt" : "blog-card"
    const message = props.message
    const background = {background: `url("${message['picture']}") center no-repeat`}

    const tagsList = message['tags'].map((value, index) => {
        return (
            <li key={index}>
                <Link to={`${props.match.match.path}/tag/${value['tagid']}`}>{value['tagname']}</Link>
            </li>
        )
    })

    return (
        <div className={position}>
            <div className="photo" style={background}></div>
            <ul className="details">
                <li className="author"><Icon type='user'/> {message['author']}</li>
                <li className="date"><Icon type='calendar'/> {message['date']}</li>
                <li className="tags">
                    <ul>
                        <li><Icon type='tags-o'/> </li>
                        {tagsList}
                    </ul>
                </li>
            </ul>
            <div className="description">
                <h1>{message['title']}</h1>
                <h2>{message['subtitle']}</h2>
                <p className="summary">{message['summary']}</p>
                <Link to={`${props.match.match.path}/article/${message['id']}`}>Read More</Link>
            </div>
        </div>
    )
}

export default BlogCard