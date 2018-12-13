var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()


router.get('/www/category', function (req,res) {
  var user = req.session['user']
  var categoryid = parseInt(req.query.categoryid) || 1
  db.query(`SELECT Name FROM categories WHERE Id = ${categoryid}`, function (err,categoryname) {
    if (err) {
      return json({
        error: 1,
        message: '请稍后重试'
      })
    }
    db.query(`SELECT * FROM categories`, function (err,categorydata) {
      if (err) {
        return json({
          error: 1,
          message: '请稍后重试'
        })
      }
      db.query(`SELECT Id,Title,ISBN,UnitPrice FROM books WHERE CategoryId = ${categoryid} LIMIT 0,12` ,function (err,data) {
        if (err) {
          return json({
            error: 1,
            message: '请稍后重试'
          })
        }

        res.render('web/category.html',{
          user,
          categoryid,
          categorydata,
          data,
          categoryname: categoryname[0].Name
        })
      })
    })
  })
})





module.exports = router
