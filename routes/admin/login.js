var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

router.get('/login', function (req,res) {
  res.render('admin/login.html')
})

router.post('/login', function (req,res) {
  var user = req.body
  if(user.name === '' || user.password === '') {
    return res.json({
      error: 1,
      message: '请输入用户名或密码'
    })
  }
  db.query(`SELECT * FROM admin where name = '${user.name}'` ,
  function (err,data) {
    if (err) {
      console.log(err)
      return res.json({
        error: 1,
        message: '无此用户或密码错误'
      })
    }
    if(user.password !== data[0].password) {
      return res.json({
        error: 1,
        message: '无此用户或密码错误'
      })
    }
    req.session.admin = data[0]
    res.json({
      error: 0,
      message: '登录成功'
    })
  })
})



module.exports = router
