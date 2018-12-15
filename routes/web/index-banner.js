var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var size = 5

var router = express.Router()

router.get('/www/index-banner', function (req,res) {
  var page = req.query.page
  var offset = (page - 1) * size
  db.query(`SELECT Id,Title,Author,ContentDescription,ISBN FROM books LIMIT ${offset},${size}`,
  function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

    res.json({
      data
    })

  })
})




module.exports = router
