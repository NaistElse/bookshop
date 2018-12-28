var express = require('express')
var db = require('../../function.config.js')


var router = express.Router()

router.get('/order' ,function (req,res) {

  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  db.query(`SELECT orders.Id,orders.OrderDate,users.Name as coustom_name,
            orderbook.BookID,books.Title,books.UnitPrice as book_price,orderbook.Quantity,
            orderbook.UnitPrice as book_total,orders.TotalPrice
            FROM orders
            INNER JOIN orderbook ON orders.Id=orderbook.OrderID
            INNER JOIN users ON users.Id=orders.UserId
            INNER JOIN books ON books.Id=orderbook.BookID`,
  function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }
    res.render('admin/order.html',{
      url: req.url,
      data
    })

  })

})


module.exports = router
