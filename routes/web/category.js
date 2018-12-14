var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()


var size = 12
var total_pages = 0


router.get('/www/category', function (req,res) {

  var where = '1 = 1'
  var search = ''

  var user = req.session['user']
  var categoryid = parseInt(req.query.category) || 1
  var page = parseInt(req.query.page) || 1

  if (page <1 ){
    page = 1
  }

  where +=' and books.CategoryId = ' + categoryid
  search +='&category=' + categoryid

  db.query(`SELECT count(0) as count FROM books WHERE ${where}` ,function (err,data) {
    if (data[0].count === 0) {
      return res.render('404.html')
    }

    total_pages = parseInt(Math.ceil(data[0].count / size))

    if (page > total_pages) {
      page = total_pages
    }

    var offset = (page - 1) * size

    db.query(`SELECT Name FROM categories WHERE Id = ${categoryid}`, function (err,categoryname) {
      if (err) {
        return res.json({
          error: 1,
          message: '请稍后重试'
        })
      }
      db.query(`SELECT * FROM categories`, function (err,categorydata) {
        if (err) {
          return res.json({
            error: 1,
            message: '请稍后重试'
          })
        }
        db.query(`SELECT Id,Title,ISBN,UnitPrice FROM books WHERE ${where} LIMIT ${offset},${size}` ,function (err,data) {
          if (err) {
            return res.json({
              error: 1,
              message: '请稍后重试'
            })
          }

          var visiable = 5

          var begin = page - (visiable -1 ) / 2
          var end = begin + visiable - 1

          begin = begin < 1 ? 1 : begin;
          end = begin + visiable - 1;
          end =end > total_pages ? total_pages : end;
          begin =end - visiable +1;
          begin = begin < 1 ? 1 : begin;


          var pagination ={
            begin,
            page,
            end,
            total_pages,
            search
          }

          res.render('web/category.html',{
            user,
            categoryid,
            categorydata,
            data,
            categoryname: categoryname[0].Name,
            pagination: pagination
          })
        })
      })
    })
  })
})





module.exports = router
