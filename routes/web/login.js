var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()

router.get('/web/login', function (req,res) {
  res.render('web/login.html')
})


module.exports = router
