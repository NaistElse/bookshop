var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()

router.get('/web/signout', function (req,res) {
  if(req.url === '/web/signout') {
    req.session['user'] = null
    res.redirect('/web/login')
  }
})



module.exports = router
