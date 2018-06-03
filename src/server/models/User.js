const db = require('../../../db')

module.exports = db.defineModel('user', {
    name: db.STRING(20),
    username: db.STRING(20),
    password: db.STRING(255),
    token: db.STRING(255)
})