var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/category-delete', function (req,res) {
  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  var query = req.query

  if (query.name === 'category') {
    db.query(`DELETE FROM categories WHERE Id in (${query.id})`, function (err,data) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }
      res.redirect(req.headers.referer)
    })
  } else if (query.name === 'publisher') {
    db.query(`DELETE FROM publishers WHERE Id in (${query.id})`, function (err,data) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }
      res.redirect(req.headers.referer)
    })
  }
})


module.exports = router
