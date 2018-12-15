var express = require('express')
var mysql = require('mysql')

var db = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})

var router = express.Router()

router.get('/web/register', function (req,res) {
  res.render('web/register.html')
})

router.get('/www/web/register', function (req,res) {
  res.render('web/register.html')
})

router.post('/web/register', function (req,res) {
  var user = req.body
  if (!user.name || !user.password || !user.passwordagain){
    return res.json({
      error: 1,
      message: '请输入信息'
    })
  }

  if (user.password !== user.passwordagain) {
    return res.json({
      error: 2,
      message: '2次密码输入不同'
    })
  }

  db.query(`SELECT Id FROM users ORDER BY Id DESC LIMIT 1`, function (err,data) {
    if (err) {
      console.log(err)
      return res.status(500).send('database error').end()
    }
    var id = parseInt(data[0].Id) + 1
    db.query(`INSERT users(Id,LoginId,LoginPwd,UserRoleId,UserStateId) VALUES(${id},'${user.name}','${user.password}',1,1)`, function (err,data) {
      if (err) {
        console.log(err)
        return res.json({
          error: 3,
          message: '已有用户名'
        })
      }

      res.json({
        error: 0,
        message: '注册成功'
      })
    })
  })
})


module.exports = router
