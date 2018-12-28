var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/book-delete', function (req,res) {
  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  var id = req.query.id

  db.query(`DELETE FROM books WHERE Id in (${id})` ,function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }
    res.redirect(req.headers.referer)
  })
})

module.exports = router
