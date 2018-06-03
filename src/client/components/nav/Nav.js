import React from 'react'
import ReactDOM from 'react-dom'
import { NavLink } from 'react-router-dom'
import './nav-web.scss'
import './nav-h5.scss'

export default class Nav extends React.Component {
    constructor(props) {
		super(props)
	}
	
	mouseEnterFunc(event) {
		const target = event.target.nodeName === 'LI' ? event.target : event.target.parentNode
		const links = target.parentNode.childNodes

		if (!target.classList.contains('active')) {
			links.forEach((value)=>{
				if(value.classList.contains('active'))
				value.classList.remove('active')
			})
	  
			target.classList.add('active')
			this.moveUnderline(target)
		}
	}

	mouseLeaveFunc(event) {
		const target = event.target.nodeName === 'UL' ? event.target : document.querySelector('.nav-menu')
		const links = target.childNodes
		const initItem = links[this.props.underline]
		if(!initItem.classList.contains('active')) {
			links.forEach((value)=>{
				if(value.classList.contains('active'))
				value.classList.remove('active')
			})
	  
			initItem.classList.add('active')
			this.moveUnderline(initItem)
		}
	}

	moveUnderline(item) {
		const underline = item.parentNode.nextSibling
		let 
			width = item.getBoundingClientRect().width,
			height = item.getBoundingClientRect().height,
			left = item.getBoundingClientRect().left + window.pageXOffset,
			top = item.getBoundingClientRect().top + window.pageYOffset

		underline.style.width = width + 'px'
		underline.style.height = height + 'px'
		underline.style.left = left + 'px'
		underline.style.top = top + 'px'
		underline.style.transform = 'none'
	}

	componentDidMount() {
		const menu = ReactDOM.findDOMNode(this).querySelector('.nav-menu')
		const item = menu.childNodes[this.props.underline]
		this.moveUnderline(item)
		menu.addEventListener('mouseleave', (...args)=>this.mouseLeaveFunc(...args))
	}

    render() {

		return (
			<nav className="header-nav">
				<ul className="nav-menu">
					<li className="menu-title">EC</li>
					<li className="menu-item" onMouseEnter={(...args) => this.mouseEnterFunc(...args)}>
					<NavLink to="/stage/blog">Blog</NavLink>
					</li>
					<li className="menu-item" onMouseEnter={(...args) => this.mouseEnterFunc(...args)}>
					<NavLink to="/stage/tag">Tag</NavLink>
					</li>
					<li className="menu-item" onMouseEnter={(...args) => this.mouseEnterFunc(...args)}>
					<NavLink to="/stage/about">About</NavLink>
					</li>
				</ul>
				<span className="nav-target"></span>
			</nav>
		)
	}
}