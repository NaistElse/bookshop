var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})


var router = express.Router()

router.get('/www/bookdetail', function (req,res) {
  var user = req.session['user']
  var id = parseInt(req.query.id) || 4939

  db.query(`SELECT books.*, publishers.Name as publishername,categories.Name as categoryname
            FROM books
            INNER JOIN publishers ON books.PublisherId=publishers.Id
            INNER JOIN categories ON books.CategoryId=categories.Id
            WHERE books.Id = ${id} LIMIT 1`,
  function (err,data) {
    if (err) {
      return res.render('404.html')
    }
    res.render('web/bookdetail.html',{
      user,
      data:data[0]
    })
  })
})




module.exports = router
