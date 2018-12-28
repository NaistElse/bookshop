var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/web/signout', function (req,res) {
  if(req.url === '/web/signout') {
    req.session['user'] = null
    res.redirect('/web/login')
  }
})

router.get('/www/web/signout', function (req,res) {
  if(req.url === '/www/web/signout') {
    req.session['user'] = null
    res.redirect('/web/login')
  }
})



module.exports = router
