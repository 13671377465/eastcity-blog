import React from 'react'
import 'whatwg-fetch'
import ReactMarkdown from 'react-markdown'
import Fun from '../common/Common'

export default class AboutPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: ''
        }
    }

    componentDidMount() {
        const self = this
        this.props.setUnderlineStatus(3)
        fetch(`/api/getabout`)
        .then(res => res.json())
        .then(data => {
            self.setState({
                data: data['about'][0]['abouttext']
            })
        }) 
        .catch(function (error) {
            console.log('Request failed', error)
        })
    }

    render() {
        const { data } = this.state
        return (
            <ReactMarkdown source={ data } className="simple-about"/>
        )
    }
}