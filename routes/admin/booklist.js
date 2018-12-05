var express = require('express')
var mysql = require('mysql')

var db=mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'});

var router = express.Router()

var size = 20
var where = '1 = 1'
var search = ''
var total_pages = 0



// var findstauts = function (CategoryId,PublisherId,page) {
//   if(isset(CategoryId)) {
//     where += ' and publishers.Id=' + CategoryId
//     search +='&categories=' + CategoryId
//   }
//
//   if(isset(PublisherId)) {
//     where += ' and publishers.Id=' + PublisherId
//     search +='&publishers=' + PublisherId
//   }
//
//   db.query(`SELECT COUNT(1) FROM books
//             INNER JOIN publishers ON publishers.Id=books.PublisherId
//             INNER JOIN categories ON categories.Id=books.CategoryId` ,
//   function (err,data) {
//     if (err) {
//       console.log(err)
//       return res.status(500).send('database error').end()
//     }
//
//
//
//
//   })
// }


router.get('/booklist' ,function(req,res) {


  var page = req.query.page ? parseInt(req.query.page) : 1

  if (page <1 ){
    page = 1
  }


  if(req.query.category && req.query.category !== 'all') {
    where +=' and books.CategoryId = ' + req.query.category
    search +='&category=' + req.query.category
  }

  if(req.query.publishers &&req.query.publishers !== 'all') {
    where +=' and books.PublisherId = ' + req.query.publishers
    search +='&publishers=' + req.query.publishers
  }



// ==================分页=======================================
db.query(`SELECT COUNT(1) as count FROM books
          INNER JOIN publishers ON publishers.Id=books.PublisherId
          INNER JOIN categories ON categories.Id=books.CategoryId
          WHERE ${where}` ,
function (err,data) {
  if (err) {
    console.log(err)
    return res.status(500).send('database error').end()
  }

  total_pages = parseInt(Math.ceil(data[0].count / size))

  if (page > total_pages) {
    page = total_pages
  }

})

  var offset = (page - 1) * size


  db.query(`SELECT books.Id,books.Title,books.Author,publishers.Name as publishername,books.PublishDate,books.ISBN,books.UnitPrice
            FROM books
            INNER JOIN publishers ON publishers.Id = books.PublisherId
            WHERE ${where}
            LIMIT ${offset},${size}` ,
   function(err,booklistdata) {
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

    var visiable = 5

    var begin = page - (visiable -1 ) / 2
    var end = begin + visiable - 1

// ==================逻辑================================
    begin = begin < 1 ? 1 : begin;
    end = begin + visiable - 1;
    end =end > total_pages ? total_pages : end;
    begin =end - visiable +1;
    begin = begin < 1 ? 1 : begin;


    var pagination ={
      begin,
      page,
      end,
      total_pages,
      search
    }


    res.render('admin/booklist.html', {
      url: req.url,
      booklistdata: booklistdata,
      categoriesdata: categoriesdata,
      publishersdata: publishersdata,
      query: req.query,
      pagination: pagination
    })
    search =''
  })
  })
  })

  where = '1 = 1'

})


module.exports = router
