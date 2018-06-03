import React from 'react'
import { Link } from 'react-router-dom'
import 'whatwg-fetch'
import { TagCloud } from 'react-tagcloud'
import Fun from '../common/Common'

export default class TagStage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    
    componentDidMount() {
        const self = this
        this.props.setUnderlineStatus(2)
        fetch(`/api/gettag`)
        .then(res => res.json())
        .then(data => {
            return self.setState({
                data: data['tags']
            })
        })
        .catch(error => {
            console.log('Request failed', error)
        })
    }

    render() {
        const { data } = this.state

        const customRenderer = (tag, size, color) => (
                <Link
                    to={`${Fun.urlToBack(this.props[0].match.path, 1)}/blog/tag/${tag.id}`}
                    key={tag.id}
                    style={{
                        fontSize: `${size}em`,
                        borderColor: `${color}`
                    }}
                >
                    {tag.value}
                </Link>
        )
        return (
            <TagCloud tags={data}
                minSize={1}
                maxSize={3}
                renderer={customRenderer}
                className="simple-tagcloud"
            />
        )
    }
}