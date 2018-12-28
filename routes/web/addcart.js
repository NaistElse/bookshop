var express = require('express')
var fs = require('fs')
var db = require('../../function.config.js')

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

  var count = parseInt(req.query.count)

  var user = req.session['user']

  var isuser = false
  var isbook = false

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
        cart: [
          {
            book_id: book_id,
            count: count,
            select: false
          }
        ]
      }

      var cartbookobj = {
        book_id: book_id,
        count: count,
        select: false
      }

      cart.forEach(function (item) {
        if (item.user_id === user_id) {
          isuser = true
          item.cart.forEach(function (item) {
            if (item.book_id === book_id) {
              isbook = true
              item.count += count
            }
          })
        }
      })

      if (isbook === false) {
        cart.forEach(function (item) {
          if (item.user_id === user_id) {
            item.cart.push(cartbookobj)
          }
        })
      } else {
        return res.json({
          error: 3,
          message: '你已经添加过啦'
        })
      }

      if (isuser === false) {
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
