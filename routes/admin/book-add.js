var express = require('express')
var fs = require('fs')
var pathLib = require('path')
var db = require('../../function.config.js')

var router = express.Router()

var message = {
  success: 'success',
  error: 'failed',
  def: 'defauts'
}


router.get('/book-add' ,function (req,res) {

  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  db.query(`SELECT * from categories` ,function (err,categoriesdata) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

  db.query(`SELECT * FROM publishers` ,function (err,publishersdata) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }


    res.render('admin/book-add.html',{
      url: req.url,
      categoriesdata: categoriesdata,
      publishersdata: publishersdata,
      messages : message.def
    })
  })
})
})


router.post('/book-add', function (req,res) {
  var query = req.body

  db.query(`SELECT Id FROM books ORDER BY Id DESC LIMIT 1`, function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

    db.query(`SELECT * from categories` ,function (err,categoriesdata) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }

    db.query(`SELECT * FROM publishers` ,function (err,publishersdata) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }

    var id = parseInt(data[0].Id) + 1

    db.query(`INSERT INTO books
             (Id,Title,Author,PublisherId,PublishDate,ISBN,WordsCount,UnitPrice,
              ContentDescription,TOC,CategoryId,Clicks)
              VALUES
              (${id},'${query.title}','${query.author}',${parseInt(query.publishers)},
              '${query.publishdate}',
              '${query.ISBN}',${parseInt(query.wordcount)},${parseInt(query.price)},'${query.content}',
              '${query.toc}',${parseInt(query.category)},0)` ,
    function (err,data) {
      if (err) {
        console.log(err)
          return res.render('admin/book-add.html',{
            url: req.url,
            categoriesdata: categoriesdata,
            publishersdata: publishersdata,
            messages: message.error,
            query: query
          })
      }
      var files = req.files
      var ext = pathLib.parse(files[0].originalname).ext
      var newFileName = query.ISBN + ext
      var oldPath = files[0].path
      var newPath = files[0].destination + '/' + newFileName
      fs.rename(oldPath, newPath, function (err) {
        if (err) {
          return res.render('admin/book-add.html',{
            url: req.url,
            categoriesdata: categoriesdata,
            publishersdata: publishersdata,
            messages: message.error,
            query: query
          })
        }
        res.render('admin/book-add.html',{
          url: req.url,
          messages: message.success
        })
      })
    })
   })
  })
 })
})



module.exports = router
