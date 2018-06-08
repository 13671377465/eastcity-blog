# eastcity-blog

### 预览：![我的个人网站ECblog](http://www.eastcity.top/)

### 博客介绍：
为了感谢开源世界的馈赠，我又将从开源世界获得的东西又放回到了开源世界。此博客的前台页面UI灵感来自于CodePen，后台UI来自于Ant Design，
为保证UI与状态同步采用React框架，图片存储在七牛云，markdown解析和标签云组件来自于Github的开源组件。
这个博客的缺陷在于它是一个客户端渲染的SPA项目，首屏渲染与SEO极差，后续学习Redux与同构的解决方案我会再进行更新。

### 安装启动
在src/server/controllers/api.js中找到七牛云token部分，按注释填写自己的公钥密钥
在config/dbConfig.json中填写个人的数据库密码与账号
数据库文件请按src/server/models文件夹中的文件自行创建
```node
npm install
npm run build
pm2 start app.js --name ecblog
```

### 技术架构
+ 前端框架：React，React-router-dom，antd
+ 后端框架：Koa2
+ 数据操作：sequelize，whatwg-fetch
+ 小文件存储：七牛云
+ 资源管理器：webpack
+ 引用组件：react-markdown，react-tagcloud

### 下一步优化
1. 数据异步加载时添加骨架与loading层
2. 学习Redux，重构项目为同构直出
