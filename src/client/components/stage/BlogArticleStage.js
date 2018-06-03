import React from 'react'
import ReactMarkdown from 'react-markdown'
import Fun from '../common/Common'
import 'whatwg-fetch'
import './blogarticlestage-web.scss'
import './blogarticlestage-h5.scss'

export default class BlogArticle extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
        this.blogid = this.props[0].match.params['articleid']
    }

    componentDidMount() {
        const self = this
        this.props.setUnderlineStatus(1)
        fetch(`/api/getfulltext?blogid=${self.blogid}`)
        .then(res => res.json())
        .then(data => {
            self.setState({
                data: data['blog'][0]
            })
        }) 
        .catch(error => { 
            console.log('Request failed', error)
        })
    }

    render() {
        const { data } = this.state
        return (
            <article className="blog-article">
                <header className="article-header">
                    <h1 className="headline">{data['title']}</h1>
                    <div className="meta">
                    <span className="meta-border"></span>
                    <span className="author">by <span className="author-name">{data['author']} </span></span>
                    <span className="pub-date">{data['date']}</span>
                    </div>
                </header>
                <ReactMarkdown source={ data['fulltext'] } />
            </article>
        )
    }
}
