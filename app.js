var express = require('express')
var path = require('path')
var template = require('express-art-template')
var bodyParser = require('body-parser')
var booklistrouter = require('./routes/admin/booklist.js')
var bookdetail = require('./routes/admin/book-detail.js')
var bookmodify = require('./routes/admin/book-modify.js')
var bookdelete = require('./routes/admin/book-delete.js')
var bookadd = require('./routes/admin/book-add.js')

var categorypublisher = require('./routes/admin/category-publisher.js')
var categorypublisherdelete = require('./routes/admin/category-publisher-delete.js')


var customer = require('./routes/admin/customer.js')


var order = require('./routes/admin/order.js')


var webindex = require('./routes/web/index.js')
var weblogin = require('./routes/web/login.js')
var webregister = require('./routes/web/register.js')
//var url = require('url')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))


app.engine('html', template)

app.set('view options',{
  imports: {
    dateFormat: function(date){
     var a = new Date( date )
     var y = a.getFullYear()
     var m = a.getMonth() + 1
     var d = a.getDate()

     var M = m < 10 ? ('0' + m) : m
     var D = d < 10 ? ('0' + d) : d

     return y + '-' + M + '-' + D
   }
  }
})




app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get('/' ,function(req,res) {
  res.render('admin/index.html' ,{
    url: req.url
  })
})


app.use(booklistrouter)
app.use(bookdetail)
app.use(bookmodify)
app.use(bookdelete)
app.use(bookadd)

app.use(categorypublisher)
app.use(categorypublisherdelete)

app.use(customer)

app.use(order)

app.use(webindex)
app.use(weblogin)
app.use(webregister)




app.listen(3300, function() {
  console.log('server is running at 3300...')
})
