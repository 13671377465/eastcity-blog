import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import './public/stylesheet/init.scss'
import StagePage from './components/stagepage/StagePage'

class RouterContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Router>
                <div style={{height: '100%'}}>
                <Switch>
                    <Route path="/stage" component={StagePage} />
                    <Redirect to="/stage/blog" />
                </Switch>
                </div>
            </Router>
        )
    }
}

ReactDOM.render(
    (
        <RouterContainer/>
    ),
    document.querySelector(`.${document.querySelector('html').getAttribute('data-media')}`)
)