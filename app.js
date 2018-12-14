var express = require('express')
var path = require('path')
var template = require('express-art-template')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser')
var multer = require('multer')
var multerObj = multer({dest: './public/upload'})
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
app.use(multerObj.any())

app.use(cookieParser())
app.use(session({
  secret: 'mac',
  resave: false,
  saveUninitialized: false
}))




app.use(require('./routes/admin/index.js'))
app.use(require('./routes/admin/login.js'))
app.use(require('./routes/admin/booklist.js'))
app.use(require('./routes/admin/book-detail.js'))
app.use(require('./routes/admin/book-modify.js'))
app.use(require('./routes/admin/book-delete.js'))
app.use(require('./routes/admin/book-add.js'))

app.use(require('./routes/admin/category-publisher.js'))
app.use(require('./routes/admin/category-publisher-delete.js'))

app.use(require('./routes/admin/customer.js'))

app.use(require('./routes/admin/order.js'))

app.use(require('./routes/web/index.js'))
app.use(require('./routes/web/login.js'))
app.use(require('./routes/web/register.js'))

app.use(require('./routes/web/index-banner.js'))
app.use(require('./routes/web/addcart.js'))
app.use(require('./routes/web/ilike.js'))
app.use(require('./routes/web/category.js'))
app.use(require('./routes/web/signout.js'))




app.listen(3300, function() {
  console.log('server is running at 3300...')
})
