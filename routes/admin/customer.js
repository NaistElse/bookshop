var express = require('express')
var db = require('../../function.config.js')

var router = express.Router()

var message = {
  success: 'success',
  error: 'failed',
  def: 'defauts'
}

router.get('/customer', function (req,res) {
  if (!req.session['admin']) {
    return res.redirect('/login')
  }

  var query = req.query

  if(JSON.stringify(query) !== '{}') {
    db.query(`UPDATE users SET UserStateId=${parseInt(query.state)} WHERE id=${parseInt(query.id)}`,
    function (err,data) {
      if (err) {
        console.log(err)
        res.render('admin/customer.html', {
          url: req.url,
          data: data,
          messages: message.error
        })
      }

      db.query(`SELECT users.Id,users.LoginId,users.Name,users.Address,
                users.Phone,Mail,userroles.Name as role,userstates.Name as state
                FROM users
                INNER JOIN userroles ON userroles.Id=users.UserRoleId
                INNER JOIN userstates ON userstates.Id=users.UserStateId`,
      function (err,data) {
        if (err) {
          console.log(err)
          return res.status(500).send('database error').end()
        }

        res.render('admin/customer.html', {
          url: req.url,
          data: data,
          messages: message.success
        })
      })
    })

  } else {
    db.query(`SELECT users.Id,users.LoginId,users.Name,users.Address,
              users.Phone,Mail,userroles.Name as role,userstates.Name as state
              FROM users
              INNER JOIN userroles ON userroles.Id=users.UserRoleId
              INNER JOIN userstates ON userstates.Id=users.UserStateId`,
    function (err,data) {
      if (err) {
        console.log(err)
        return res.status(500).send('database error').end()
      }

      res.render('admin/customer.html', {
        url: req.url,
        data: data,
        messages: message.def
      })
    })
  }
})



module.exports = router
