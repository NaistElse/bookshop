var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()

var images = {
  error: 0,
  src: [
    '../../public/images/banner1.jpg',
    '../../public/images/banner2.jpg',
    '../../public/images/banner3.jpg',
    '../../public/images/banner4.jpg'
  ]
}


router.get('/www/index-banner', function (req,res) {
  res.json({
    data: images
  })
})


module.exports = router
