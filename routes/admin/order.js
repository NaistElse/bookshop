var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})


var router = express.Router()

router.get('/order' ,function (req,res) {
  res.render('admin/order.html',{
    url: req.url
  })
})


module.exports = router
