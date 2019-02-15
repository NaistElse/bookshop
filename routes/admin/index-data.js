var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/index-data', function(req,res) {
  db.query(`SELECT categories.Name as name, count(1) as value FROM books
            INNER JOIN categories ON books.CategoryId = categories.Id GROUP BY CategoryId`,
  function (err, booksdata) {
    if(err) {
      return res.json({
        error: 1,
        message: '服务器繁忙，请稍后重试。。。'
      })
    }

    db.query(`SELECT date_format(orders.OrderDate,'%Y-%m-%d') as date,
              sum(orders.TotalPrice) as totalprice FROM orders
              GROUP BY date_format(orders.OrderDate,'%Y-%m-%d')`, function (err, ordersdata) {
                if (err) {
                  return res.json({
                    error: 1,
                    message: '服务器繁忙，请稍后重试。。。'
                  })
                }
                res.json({
                  error: 0,
                  message: [
                    booksdata,
                    ordersdata
                  ]
                })
              })
  }
)
})

module.exports = router
