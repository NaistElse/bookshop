var express = require('express')
var mysql = require('mysql')

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'});

var router = express.Router()

var categoriesdata = []
var publishersdata = []

var categoryid = 0
var publisherid = 0

var message = {
  success: 'success',
  error: 'failed',
  def: 'defauts',
  updatesuccess: 'updatesuccess',
  updateerror: 'updateerror'
}


router.get('/categories', function (req,res) {

  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  var query = req.query


  getdata('SELECT * from categories')
    .then(function (data) {
      categoriesdata = data
      return getdata('SELECT * FROM publishers')
    })
    .then(function (data){
      publishersdata = data
    })
    .then(function () {

      if (JSON.stringify(query) !== '{}') {
        if (query.name === 'category') {
          getdata(`SELECT * FROM categories WHERE Id=${parseInt(query.id)}`)
            .then(function (data) {
              data[0].class = 'category'
              res.render('admin/categories.html', {
                url: req.url,
                data: data[0],
                categoriesdata,
                publishersdata,
                messages: message.def
              })
            })
        } else if (query.name === 'publisher') {
          getdata(`SELECT * FROM publishers WHERE Id=${parseInt(query.id)}`)
            .then(function (data) {
              data[0].class = 'publisher'
              res.render('admin/categories.html', {
                url: req.url,
                data: data[0],
                categoriesdata,
                publishersdata,
                messages: message.def
              })
            })
        }
      } else {
        res.render('admin/categories.html', {
          url: req.url,
          categoriesdata,
          publishersdata,
          messages: message.def
        })
      }
    })
})


router.post('/categories', function (req,res) {
  var query = req.body

  getdata('SELECT * from categories')
    .then(function (data) {
      categoriesdata = data
      return getdata('SELECT * FROM publishers')
    })
    .then(function (data){
      publishersdata = data
      return getdata('SELECT Id FROM categories ORDER BY Id DESC LIMIT 1')
    })
   .then(function (data) {
     categoryid = parseInt(data[0].Id) + 1
     return getdata('SELECT Id FROM publishers ORDER BY Id DESC LIMIT 1')
   })
   .then(function (data) {
     publisherid = parseInt(data[0].Id) + 1
   })
   .then(function () {

     if (query.kind && query.kind === 'category') {
       getdata(`UPDATE categories SET Name='${query.name}' WHERE Id=${parseInt(query.id)}`)
         .then(function () {
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
                 publishersdata,
                 messages: message.updatesuccess
               })
             })
         }, function () {
           res.render('admin/categories.html', {
             url: req.url,
             categoriesdata,
             publishersdata,
             messages: message.updateerror
           })
         })
     } else if (query.kind && query.kind === 'category') {
       getdata(`UPDATE publishers SET Name='${query.name}' WHERE Id=${parseInt(query.id)}`)
         .then(function () {
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
                 publishersdata,
                 messages: message.updatesuccess
               })
             })
         }, function () {
           res.render('admin/categories.html', {
             url: req.url,
             categoriesdata,
             publishersdata,
             messages: message.updateerror
           })
         })
     }

     if (query.stauts && query.stauts === 'category') {
       getdata(`INSERT INTO categories VALUES(${categoryid},'${query.name}')`)
         .then(function () {
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
                 publishersdata,
                 messages: message.success
               })
             })
         },function () {
           res.render('admin/categories.html', {
             url: req.url,
             categoriesdata,
             publishersdata,
             messages: message.error
           })
         })
     } else if (query.stauts && query.stauts === 'publisher') {
       getdata(`INSERT INTO publishers VALUES(${publisherid},'${query.name}')`)
         .then(function () {
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
                 publishersdata,
                 messages: message.success
               })
             })
         },function () {
           res.render('admin/categories.html', {
             url: req.url,
             categoriesdata,
             publishersdata,
             messages: message.error
           })
         })
     }
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
