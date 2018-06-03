import React from 'react'
import './banner-web.scss'
import './banner-h5.scss'
import Nav from '../nav/Nav'

const Banner = (props) => {
	return(
		<header className="header">
			<Nav underline={props.underline} />
			<div className="header-title">
				<h1>EC BLOG</h1>
			</div>
		</header>
	)
}

export default Banner