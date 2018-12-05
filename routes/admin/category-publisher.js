var express = require('express')
var mysql = require('mysql')

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'});

var router = express.Router()

var categoriesdata = []
var publishersdata = []

router.get('/categories', function (req,res) {

  getdata('SELECT * from categories')
    .then(function (data) {
      categoriesdata = data
      return getdata('SELECT * FROM publishers')
    })
    .then(function (data){
      publishersdata = data
    })
    .then(function () {
      res.render('admin/categories.html', {
        url: req.url,
        categoriesdata,
        publishersdata
      })
    })
})


var getdata = function (query, callback) {
  return new Promise(function (resolve, reject) {
    db.query( query ,function (err,data) {
      if (err) {
        reject(err)
      }
      callback && callback(data)
      resolve(data)
  })
 })
}


module.exports = router
