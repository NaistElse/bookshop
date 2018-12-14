var express = require('express')
var mysql = require('mysql')

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'});

var router = express.Router()

router.get('/book-modify' , function (req,res) {
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

  db.query(`SELECT * from categories`, function (err,categorydata) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

  db.query(`SELECT * FROM publishers` ,function (err,publisherDate) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

    res.render('admin/book-modify.html',{
      book: data[0],
      category: categorydata,
      publisher: publisherDate
    })
  })
  })
  })
})


router.post('/book-modify' , function (req,res) {
  var bookmodify = req.body

  db.query(`UPDATE books SET Title = '${bookmodify.Title}',CategoryId = ${parseInt(bookmodify.Category)},
            Author = '${bookmodify.Author}',PublisherId = ${parseInt(bookmodify.publisher)},
            PublishDate = '${bookmodify.PublishDate}',ISBN = '${bookmodify.ISBN}',
            WordsCount = ${parseInt(bookmodify.WordsCount)},UnitPrice = ${parseInt(bookmodify.UnitPrice)},
            ContentDescription = '${bookmodify.ContentDescription}',
            TOC = '${bookmodify.TOC}'
            WHERE Id = ${parseInt(bookmodify.Id)}`,
  function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

  res.redirect('/book-detail?id=' + bookmodify.Id)
  })
})




module.exports = router
