var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()

router.get('/web/login', function (req,res) {
  res.render('web/login.html')
})

router.post('/web/login', function (req,res) {
  var user = req.body
  if(user.loginId === '' || user.password === '') {
    return res.json({
      error: 1,
      message: '请输入用户名或密码'
    })
  }
  db.query(`SELECT * FROM users where LoginId = '${user.loginId}'` ,
  function (err,data) {
    if (err) {
      console.log(err)
      return res.json({
        error: 1,
        message: '无此用户或密码错误'
      })
    }
    if(user.password !== data[0].LoginPwd) {
      return res.json({
        error: 1,
        message: '无此用户或密码错误'
      })
    }
    req.session.user = data[0]
    //req.cookies['user'] = data[0]
    res.json({
      error: 0,
      message: '登录成功'
    })
  })
})



module.exports = router
