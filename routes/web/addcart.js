var express = require('express')
var mysql = require('mysql')
var fs = require('fs')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})


var router = express.Router()

router.get('/www/addcart', function (req,res) {
  if (!req.session['user']) {
    return res.json({
        error: 1,
        message: '请登录'
      })
  }
  var user_id = parseInt(req.session['user'].Id)
  // var user_id = parseInt(req.cookies['user'].Id)
  var book_id = parseInt(req.query.id)

  var user = req.session['user']

  fs.readFile('./data/user-cart.json','utf8', function (err,data) {
    if (err) {
      return res.json({
          error: 2,
          message: '加入购物车失败'
        })
    }
      var cart = JSON.parse(data)

      var cartobj = {
        user_id: user_id,
        cart: {
          book_id: [book_id]
        }
      }

      var reslut = cart.some(function (item) {
        return item.user_id === user_id
      })

      if (reslut) {
        cart.forEach(function (item) {
          if(item.user_id === user_id) {
            item.cart.book_id.push(book_id)
          }
        })
      } else {
        cart.push(cartobj)
      }

      fs.writeFile('./data/user-cart.json',JSON.stringify(cart), function (err) {
        if (err) {
          return res.json({
              error: 2,
              message: '加入购物车失败'
            })
        }
        res.json({
          error: 0,
          message: 'ok'
        })
      })
    })
})




module.exports = router
