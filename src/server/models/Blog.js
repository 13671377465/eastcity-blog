const db = require('../../../db')

module.exports = db.defineModel('blog', {
    tags: db.STRING(200),
    title: db.STRING(20),
    subtitle: db.STRING(20),
    summary: db.TEXT(0),
    fulltext: db.TEXT(0),
    date: db.STRING(20),
    picture: db.STRING(50),
    author: db.STRING(20),
})