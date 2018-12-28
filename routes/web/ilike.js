var express = require('express')
var fs = require('fs')
var db = require('../../function.config.js')


var router = express.Router()


router.get('/www/ilick', function (req,res) {
  if (!req.session['user']) {
    return res.json({
        error: 1,
        message: '请登录'
      })
  }

  var user_id = parseInt(req.session['user'].Id)
  var book_id = parseInt(req.query.id)

  fs.readFile('./data/user-like.json','utf8', function (err,data) {
    if (err) {
      return res.json({
          error: 2,
          message: '喜欢她失败'
        })
    }
      var like = JSON.parse(data)

      var likeobj = {
        user_id: user_id,
        book_id: [book_id]
      }

      var reslutuser = like.some(function (item) {
        return item.user_id === user_id
      })

      if (reslutuser) {
        like.forEach(function (item) {
          if (item.user_id === user_id) {
            if (!item.book_id.some(function (item) {return item === book_id})) {
              item.book_id.push(book_id)
              db.query(`UPDATE books SET Clicks = Clicks+1 WHERE Id = ${book_id}`, function (err,data) {
                if (err) {
                  return res.json({
                      error: 2,
                      message: '喜欢她失败'
                    })
                }
                res.json({
                  error: 0,
                  message: 'ok'
                })
              })
            } else {
              return res.json({
                  error: 3,
                  message: '你已经喜欢她啦'
                })
            }
          }
        })
      } else {
        like.push(likeobj)
        db.query(`UPDATE books SET Clicks = Clicks+1 WHERE Id = ${book_id}`, function (err,data) {
                if (err) {
                  return res.json({
                      error: 2,
                      message: '喜欢她失败'
                    })
                }
                res.json({
                  error: 0,
                  message: 'ok'
                })
              })
      }

      fs.writeFile('./data/user-like.json',JSON.stringify(like), function (err) {
        if (err) {
          return res.json({
              error: 2,
              message: '喜欢她失败'
            })
        }
      })
    })
})





module.exports = router
