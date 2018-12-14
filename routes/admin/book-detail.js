var express = require('express')
var mysql = require('mysql')

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()

router.get('/book-detail' , function (req,res) {
  if (!req.session['admin']) {
    return res.redirect('/login')
  }
  
  db.query(`SELECT books.Id,books.Title,books.Author,publishers.Name as Publishername,books.PublishDate,books.ISBN,
            books.WordsCount,books.UnitPrice,
            books.ContentDescription,books.AurhorDescription,books.EditorComment,books.TOC,
            categories.Name as Categoryname
            FROM books
            INNER JOIN publishers ON publishers.Id=books.PublisherId
            INNER JOIN categories ON categories.Id=books.CategoryId
            WHERE books.Id=${parseInt(req.query.id)}` ,
  function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

    res.render('admin/book-detail.html',{
      book: data[0]
    })
  })


})




module.exports = router
