const db = require('../../../db')

module.exports = db.defineModel('tag', {
    value: db.STRING(20),
    count: db.STRING(5),
})