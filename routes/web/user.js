var express = require('express')
var mysql = require('mysql')
var fs = require('fs')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})


var router = express.Router()

router.get('/www/user', function (req,res) {
  if (!req.session['user']) {
    return res.json({
        error: 1,
        message: '请登录'
      })
  }
  var user = req.session['user']
  var user_id = parseInt(req.session['user'].Id)
  // var user_id = 18
  var books = []
  var bookid = []

  fs.readFile('./data/user-cart.json','utf8', function (err,data) {
    if (err) {
      return res.json({
        error:2,
        message: '加载购物车失败'
      })
    }

    var cart = JSON.parse(data)

    cart.forEach(function (item) {
      if (item.user_id === user_id) {
        books = item.cart
      }
    })

    books.forEach(function (item) {
      bookid.push(item.book_id)
    })

    db.query(`SELECT Id,Title,Author,UnitPrice FROM books WHERE Id in (${bookid})`, function (err,data) {
      if (err) {
        return res.json({
          error:2,
          message: '加载购物车失败'
        })
      }

      data.forEach(function (item,i) {
        item.count = books[i].count
        item.select = books[i].select
      })


      res.render('web/user.html',{
        user,
        data
      })
    })
  })
})


router.post('/www/user', function (req,res) {
  if (!req.session['user']) {
    return res.json({
        error: 1,
        message: '请登录'
      })
  }
  var user = req.session['user']
  var user_id = parseInt(req.session['user'].Id)
  // var user_id = 18
  var books = []
  var bookid = []

  fs.readFile('./data/user-cart.json','utf8', function (err,data) {
    if (err) {
      return res.json({
        error:2,
        message: '加载购物车失败'
      })
    }

    var cart = JSON.parse(data)

    cart.forEach(function (item) {
      if (item.user_id === user_id) {
        books = item.cart
      }
    })

    books.forEach(function (item) {
      bookid.push(item.book_id)
    })

    db.query(`SELECT Id,Title,Author,UnitPrice FROM books WHERE Id in (${bookid})`, function (err,data) {
      if (err) {
        return res.json({
          error:2,
          message: '加载购物车失败'
        })
      }

      data.forEach(function (item,i) {
        item.count = books[i].count
        item.select = books[i].select
      })

      res.json({
        userid: user.Id,
        data
      })
    })
  })

})




module.exports = router
