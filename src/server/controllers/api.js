const model = require('../../../model')
const logger = require('../../../config/logConfig')
const qiniu = require('qiniu')
const bcrypt = require("bcrypt")
const UA = require('ua-device')
const Cookies = require('cookies') 

let 
	User = model.User,
	Tag = model.Tag,
    Blog = model.Blog,
    About = model.About

const fn_getHash = async( password ) => {
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds)
    return bcrypt.hashSync(password, salt)
}

const fn_checkHash = async( password, hash ) => {
    return bcrypt.compareSync( password, hash )
}

const fn_render = async(ctx) => {
	let useragent = ctx.request.header['user-agent']
	let media = await new UA(useragent).device['type']
	let mediaClass = media === 'mobile' ? 'h5-blog' : 'web-blog'
	await ctx.render('page', {
		media: mediaClass
	})
}

const fn_getBlogAndTag = async(ctx) => {
    const tagid = ctx.request.query['tagid']
    const tags = await Tag.findAll()
	logger.debug('已获取tags全部数据')
	let blogs = await Blog.findAll({
		attributes: ['id', 'title', 'subtitle', 'summary', 'author', 'picture', 'date', 'tags']
	})
	logger.debug('已获取blogs全部数据')
    if(tagid !== '0') {
        blogs = blogs.filter(blog => {
            return blog['tags'].split(',').includes(tagid)
        })
    }
    ctx.body = {
        tags: tags,
		blogs: blogs
    }
}

const fn_getTag = async(ctx) => {
    console.log("fff")
    const tags = await Tag.findAll()
	logger.debug('已获取tags全部数据')
    ctx.body = {
        tags: tags
    }
}

const fn_getAbout = async(ctx, next) => {
    const about = await About.findAll({
    })
    ctx.body = {
        about: about
    }
}

const fn_getFulltext = async(ctx) => {
    const blogid = ctx.request.query['blogid']
    const blog = await Blog.findAll({
        where: {id: blogid}
    })
    ctx.body = {
        blog: blog
    }
}

const fn_login = async(ctx, next) => {
    const username = ctx.request.body['username']
    const password = ctx.request.body['password']
    const stringToken = `ecblog${new Date()}`

    const selectResult = await User.findAll({
        attributes: ['password'],
        where: {id: '7a247a5f-8486-4f3a-85e4-59a0ee75d88d'}
    })
    let flag = await fn_checkHash( password, selectResult[0]['password'])
    if( flag ) {
        const hashToken = await fn_getHash(stringToken)
        await User.update({
            token: hashToken
        }, {
            where: {id: '7a247a5f-8486-4f3a-85e4-59a0ee75d88d'}
        })
        ctx.cookies.set('ecblogtoken', hashToken, {maxAge: 7200000})
        ctx.body = {
            status: 'success'
        }
    } else {
        ctx.body = {
            status: 'false'
        }
    }
}

const fn_checkLogin = async(ctx) => {
    const browCookie = ctx.cookies.get('ecblogtoken')

    const selectResult = await User.findAll({
        attributes: ['name', 'token'],
        where: {id: '7a247a5f-8486-4f3a-85e4-59a0ee75d88d'}
    })
    let flag = browCookie === selectResult[0]['token']

    if( flag ) {
        ctx.body = {
            status: 'success',
            name: selectResult[0]['name']
        }
    } else {
        ctx.body = {
            status: 'false'
        }
    }
}

const fn_signOut = async(ctx) => {
    ctx.cookies.set('ecblogtoken', '', {maxAge: 0})
    await User.update({
        token: ''
    }, {
        where: {id: '7a247a5f-8486-4f3a-85e4-59a0ee75d88d'}
    })
    ctx.body = {
        status: 'success'
    }
}

const fn_getToken = async(ctx, next) => {
    /* 获取七牛云Token*/
    const accessKey = 'nHKahXXvFXX6J1jSDXuEI-jaYU36DAd-g1A7bORB'
    const secretKey = 'Rhv5WER-3TafJVtu2_gSOyBZw-9Iqv35JWvAE9cg'
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
    const putPolicy = new qiniu.rs.PutPolicy({
        scope: 'crawler'
    })
    const uploadToken = putPolicy.uploadToken(mac)
    /* 根据blogid返回blog信息*/
    const blogid = ctx.request.body['blogid']
    let blogs = {}
    if( blogid ) {
        blogs = await Blog.findAll({
            where:{id: blogid}
        })
    }
    tags = await Tag.findAll()
    ctx.body = {
        uptoken: uploadToken,
        blogs: blogs,
        tags: tags
    }
}

const fn_createtag = async(ctx, next) => {
    const tagname = ctx.request.body['tagname'],
        tagcount = ctx.request.body['tagcount']
    const result = await Tag.create({
        value: tagname,
        count: tagcount
    })
    const data = await Tag.findAll()
    if( result ) {
        ctx.body = {
            tags: data
        }
    }
}

const fn_deletetag = async(ctx, next) => {
    const tagid = ctx.request.body['tagid']
    const result = await Tag.destroy({
        where:{id: tagid}
    })
    const data = await Tag.findAll()
    if( result ) {
        ctx.body = {
            tags: data
        }
    }
}

const fn_updatetag = async(ctx, next) => {
    const tagid = ctx.request.body['tagid'],
         tagname = ctx.request.body['tagname'],
         tagcount = ctx.request.body['tagcount']
    const result = await Tag.update(
       {
           value: tagname,
           count: tagcount
        }, {
            where: {id: tagid}
        }
    )
    const data = await Tag.findAll()
    if( result ) {
        ctx.body = {
            tags: data
        }
    }
}

const fn_createblog = async(ctx, next) => {
    const
        date = new Date(),
        blogtags =  ctx.request.body['blogtags'],
        blogtitle =  ctx.request.body['blogtitle'],
        blogsubtitle =  ctx.request.body['blogsubtitle'],
        blogsummary =  ctx.request.body['blogsummary'],
        blogfulltext =  ctx.request.body['blogfulltext'],
        blogdate =  `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`,
        blogpicture =  ctx.request.body['blogpicture'],
        blogauthor =  ctx.request.body['blogauthor']


    const result = await Blog.create({
        tags: blogtags,
        title: blogtitle,
        subtitle: blogsubtitle,
        summary: blogsummary,
        fulltext: blogfulltext,
        date: blogdate,
        picture: blogpicture,
        author: blogauthor
    })

    ctx.body = {
        status: result ? 'success' : 'false'
    }
}

const fn_deleteblog = async(ctx, next) => {
    const blogid = ctx.request.body['blogid'].split(',')
    const result = await Blog.destroy({
        where:{id: blogid}
    })

    ctx.body = {
        status: result ? 'success' : 'false'
    }
}

const fn_updateblog = async(ctx, next) => {
    const
        blogid = ctx.request.body['blogid'],
        blogtags =  ctx.request.body['blogtags'],
        blogtitle =  ctx.request.body['blogtitle'],
        blogsubtitle =  ctx.request.body['blogsubtitle'],
        blogsummary =  ctx.request.body['blogsummary'],
        blogfulltext =  ctx.request.body['blogfulltext'],
        blogpicture =  ctx.request.body['blogpicture'],
        blogauthor =  ctx.request.body['blogauthor']

    const result = await Blog.update({
        tags: blogtags,
        title: blogtitle,
        subtitle: blogsubtitle,
        summary: blogsummary,
        fulltext: blogfulltext,
        picture: blogpicture,
        author: blogauthor
    }, {
        where: {id: blogid}
    })

    ctx.body = {
        status: result ? 'success' : 'false'
    }
}

const fn_updateAbout = async(ctx, next) => {
    const abouttext = ctx.request.body['abouttext']
    const text = await About.update({
        abouttext: abouttext
    },{
        where: {id: '8c344814-99f8-4330-b9d6-4b3be4b5ccf6'}
    })

    if( text ) {
        ctx.body = {
            status: 'true'
        }
    } else {
        ctx.body = {
            status: 'false'
        }
    }
}

const fn_updatePassword = async(ctx, next) => {
    const oldpassword = ctx.request.body['oldpassword']
    const newpassword = await fn_getHash(ctx.request.body['newpassword'])

    const selectResult = await User.findAll({
        attributes: ['password'],
        where: {id: '7a247a5f-8486-4f3a-85e4-59a0ee75d88d'}
    })

    let flag = await fn_checkHash( oldpassword, selectResult[0]['password'])
    let result

    if( flag ) {
        result = await User.update({
            password: newpassword
        }, {
            where: {id: '7a247a5f-8486-4f3a-85e4-59a0ee75d88d'}
        })
    }

    const bool = result ? true : false
    
    ctx.body = {
        status: bool
    }
}

module.exports = {
    'GET /': fn_render,
    'GET /api/getblogandtag': fn_getBlogAndTag,
    'GET /api/gettag': fn_getTag,
    'GET /api/getabout': fn_getAbout,
    'GET /api/getfulltext': fn_getFulltext,
    'POST /api/login': fn_login,
    'POST /api/checklogin': fn_checkLogin,
    'POST /api/signout': fn_signOut,
    'POST /api/gettoken': fn_getToken,
    'POST /api/updatepassword': fn_updatePassword,
    'POST /api/createtag': fn_createtag,
    'POST /api/deletetag': fn_deletetag,
    'POST /api/updatetag': fn_updatetag,
    'POST /api/createblog': fn_createblog,
    'POST /api/deleteblog': fn_deleteblog,
    'POST /api/updateblog': fn_updateblog,
    'POST /api/updateabout': fn_updateAbout,
    
}