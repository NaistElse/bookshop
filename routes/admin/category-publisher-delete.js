var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'});

var router = express.Router()

router.get('/category-delete', function (req,res) {

  var query = req.query

  if (query.name === 'category') {
    db.query(`DELETE FROM categories WHERE Id in (${query.id})`, function (err,data) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }
      res.redirect(req.headers.referer)
    })
  } else if (query.name === 'publisher') {
    db.query(`DELETE FROM publishers WHERE Id in (${query.id})`, function (err,data) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }
      res.redirect(req.headers.referer)
    })
  }
})


module.exports = router
