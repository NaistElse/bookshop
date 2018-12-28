var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()


router.get('/' ,function(req,res) {
  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  res.render('admin/index.html' ,{
    url: req.url
  })
})


module.exports = router
