var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/pay', function(req,res) {
  var paybooks = req.query.data
  var user_id = parseInt(req.session['user'].Id)
  var totalprice = 0
  paybooks.some(function(item) {
    totalprice += item.UnitPrice * item.count
  })

  db.query(`SELECT Id FROM orders ORDER BY Id DESC LIMIT 1`, function (err,data) {
    if (err) {
      return res.json({
        error: 1,
        message: '服务器繁忙，请稍后重试。。。'
      })
    }
    var id = parseInt(data[0].Id) + 1

    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth()
    var date = now.getDate()
    var day = now.getDay()
    var hour = now.getHours()
    var minu = now.getMinutes()
    var sec = now.getSeconds()
    month = month + 1
    if (month < 10) month = "0" + month
    if (date < 10) date = "0" + date
    if (hour < 10) hour = "0" + hour
    if (minu < 10) minu = "0" + minu
    if (sec < 10) sec = "0" + sec
    var date = year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec


    db.query(`INSERT INTO orders (Id,OrderDate,UserId,TotalPrice) VALUES
      (${id},'${date}',${user_id},${parseInt(totalprice)})`, function (err,data) {
        if (err) {
          return res.json({
            error: 1,
            message: '服务器繁忙，请稍后重试。。。'
          })
        }
        res.json({
          error: 0,
          message: '付款成功'
        })
      })
  })

})

module.exports = router
