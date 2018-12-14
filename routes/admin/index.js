var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()


router.get('/' ,function(req,res) {
  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  res.render('admin/index.html' ,{
    url: req.url
  })
})


module.exports = router
