var express = require('express')
var fs = require('fs')
var db = require('../../function.config.js')


var router = express.Router()

router.get('/www/modifycart', function (req,res) {
  var cart = req.query.user_cart
  if (!req.session['user']) {
    return res.json({
        error: 1,
        message: '请登录'
      })
  }
  var user_id = parseInt(req.session['user'].Id)
  var user_cart = []
  cart.forEach(function (item, i) {
    var flag = item.select === "false" ? false : true
    var obj = {
      'book_id': parseInt(item.Id),
      'count': parseInt(item.count),
      'select': flag
    }
    user_cart.push(obj)
  })


  fs.readFile('./data/user-cart.json','utf8', function (err,data) {
    if (err) {
      return res.json({
          error: 2,
          message: '修改购物车失败'
        })
    }
      var cart = JSON.parse(data)

      cart.forEach(function (item) {
        if (item.user_id === user_id) {
          item.cart = user_cart
        }
      })

      fs.writeFile('./data/user-cart.json',JSON.stringify(cart), function (err) {
        if (err) {
          return res.json({
              error: 2,
              message: '修改购物车失败'
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
