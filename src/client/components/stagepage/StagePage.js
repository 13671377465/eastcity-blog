import React from 'react'
import { Route } from 'react-router-dom'
import Banner from '../banner/Banner'
import LayoutFooter from '../footer/Footer'
import BlogStage from '../stage/BlogStage'
import BlogArticleStage from '../stage/BlogArticleStage'
import TagStage from '../stage/TagStage'
import AboutStage from '../stage/AboutStage'

export default class StagePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            underlineStatus: 1
        }
    }

    setUnderlineStatus = status => {
        this.setState({
            underlineStatus: status
        })
    }

    render() {
        const { underlineStatus } = this.state
        const matchPath = this.props.match.path

        return (
            <div>
                <Banner underline={underlineStatus} />
                <main style={{background: '#FFF'}}>
                    <Route exact path={`${matchPath}/blog`} render={(...props)=>
                        <BlogStage {...props} setUnderlineStatus={this.setUnderlineStatus} />
                    } />
                    <Route path={`${matchPath}/blog/tag/:tagid`} render={(...props)=>
                        <BlogStage {...props} setUnderlineStatus={this.setUnderlineStatus} />
                    } />
                    <Route path={`${matchPath}/blog/article/:articleid`} render={(...props)=>
                        <BlogArticleStage {...props} setUnderlineStatus={this.setUnderlineStatus} />
                    } />
                    <Route path={`${matchPath}/tag`} render={(...props)=>
                        <TagStage {...props} setUnderlineStatus={this.setUnderlineStatus} />
                    } />
                    <Route path={`${matchPath}/about`} render={(...props)=>
                        <AboutStage {...props} setUnderlineStatus={this.setUnderlineStatus} />
                    } />
                </main>
                <LayoutFooter />
            </div>
        )
    }
}