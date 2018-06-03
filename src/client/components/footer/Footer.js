import React from 'react'
import { Popover } from 'antd'
import './footer-web.scss'
import './footer-h5.scss'

export default class LayoutFooter extends React.Component {
    constructor(props) {
        super(props)
	}
    
    render() {
        const content = (
            <div className="footer-popver">
              <img src="http://p3d0pinbj.bkt.clouddn.com/2141685508.jpg" />
            </div>
        )
		return (
            <footer className="blog-footer">
			<article className="footer-container">
                <section className="footer-mes"><p>本站由 阿里云 提供计算与安全服务</p></section>
                <section className="footer-copyright"><p>EC blog ©2018 Created by EastCity</p></section>
                <section className="footer-icon">
                    <Popover content={content} placement="topRight" title="我的微信" trigger="click">
                    <div><img src="http://p3d0pinbj.bkt.clouddn.com/icon_wx.png" /></div>
                    </Popover>
                </section>
            </article>
            </footer>
		)
    }
}