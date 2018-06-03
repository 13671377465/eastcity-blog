const db = require('../../../db')

module.exports = db.defineModel('about', {
    abouttext: db.TEXT(0),
})