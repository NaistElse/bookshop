var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'});

var router = express.Router()

router.get('/book-delete', function (req,res) {

  var id = req.query.id

  db.query(`DELETE FROM books WHERE Id in (${id})` ,function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }
    res.redirect(req.headers.referer)
  })
})

module.exports = router
