var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/www', function (req,res) {
  var user = req.session['user']

  db.query(`SELECT * FROM books ORDER BY Clicks desc LIMIT 9`, function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }

    res.render('web/index.html', {
      user,
      data
    })

  })

})





module.exports = router
