# 这是一个网上书店项目

（数据库的CURD和前端客户页面，因为是第一次学习而做的，代码没有优化）

## 技术栈:
1. 数据库: `Mysql`
2. 服务端: `Nodejs-Express` 框架 + `art-tempalte` 模板引擎
3. 客户端: `Bootstrap`+ `jQuery` 类库

### 文件目录:

```shell
├─data
├─node_modules
├─public
│  ├─css
│  ├─images
│  ├─js
│  ├─upload
│  └─vendors
├─routes
│  ├─admin
│  └─web
└─views
    ├─admin
    ├─web
```



### 1. 数据库设计:
1. 数据库名称: `bookshop`

2. 数据库关系图:  ![1546497987381](C:\Users\Applestore2\AppData\Roaming\Typora\typora-user-images\1546497987381.png)

### 2. 服务端设计:
1. `app.js` 入口程序
    由于是`Express` 框架  和 `art-tempalte` 模板引擎，先下载相关依赖包 `npm i express express-art-tempalte`

     ```javascript
    var express = require('express') 
    var template = require('express-art-template')
    
    var app = express() // 创建服务器
    
    app.engine('html', template) // 以 html 后缀的为模板引擎
    
    app.listen(3300, function() { // 服务器监听端口为 3300
      console.log('server is running at 3300...')
    })
     ```

    当然也免不了使用`css`, `images` 等静态资源

    ```javascript
    var path = require('path')
    
    app.use('/public/', express.static(path.join(__dirname, './public/'))) // 在文件夹public 中的所有内容为静态资源，可以任意访问
    app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
    ```

2. `booklist` 图书列表界面的实现

    路由设计: 

    |    url    | 方式 |             值             |
    | :-------: | :--: | :------------------------: |
    | /booklist | GET  | page  category  publishers |

    我们不可能把所有的路由都灌入`app.js` 中，所以`Express` 有一个路由方法帮我们解决这个问题

    ```javascript
    var express = require('express')
    var db = require('../../function.config.js')
    
    var router = express.Router() //创建路由
    router.get('/booklist' ,function(req,res) {})
    
    module.exports = router //把这个路由暴露出去
    ```

    因为接下去所有的路由都涉及数据库操作，所以先装 `npm i mysql` 这个依赖包

    在创建`function.config.js` 这个文件是配置各种常量的

    ```javascript
    var mysql = require('mysql')
    
    module.exports = mysql.createPool({host: 'localhost', user: 'root', password: '123456', database: 'bookshop'})
    ```

    因为这个页面涉及 `分页` ，`类别查询`

    ```javascript
    var page = req.query.page ? parseInt(req.query.page) : 1
    
    var size = 20  // 每页数量为20
    var where = '1 = 1' // 种类及其出版社分类
    var search = '' // 传到前端的
    var total_pages = 0  // 总页数
    
    if (page < 1){  
      page = 1
    }
    
    if(req.query.category && req.query.category !== 'all') {
       where += ' and books.CategoryId = ' + req.query.category
       search += '&category=' + req.query.category
    }
    
    if(req.query.publishers && req.query.publishers !== 'all') {
       where += ' and books.PublisherId = ' + req.query.publishers
       search += '&publishers=' + req.query.publishers
    }
    
    db.query(`SELECT COUNT(1) as count FROM books
              INNER JOIN publishers ON publishers.Id=books.PublisherId
              INNER JOIN categories ON categories.Id=books.CategoryId
              WHERE ${where}` ,
    function (err,data) {
      if (err) {
        return res.status(500).send('database error').end()
      }
    
      total_pages = parseInt(Math.ceil(data[0].count / size)) // 计算出前段传过来种类及出版社的总页数
    
      if (page > total_pages) {  // 如果page大于总页数就让它等于总页数
        page = total_pages
      }
    })
    
    var offset = (page - 1) * size  // 当前是第几页
    
    db.query(`SELECT books.Id,books.Title,books.Author,publishers.Name as publishername,books.PublishDate,books.ISBN,books.UnitPrice
                FROM books
                INNER JOIN publishers ON publishers.Id = books.PublisherId
                WHERE ${where}
                LIMIT ${offset},${size}` ,function () {}) // 得到的数据就是前端所想要的数据
    
      var visiable = 5 // 定义所显示的页码数
    
      var begin = page - (visiable -1 ) / 2  // 当前开始的页码数
      var end = begin + visiable - 1 // 当前结束的页码数
    
    // =============== 处理分页的逻辑 =====================
      begin = begin < 1 ? 1 : begin 
      end = begin + visiable - 1
      end = end > total_pages ? total_pages : end
      begin = end - visiable +1
      begin = begin < 1 ? 1 : begin
    
    
      var pagination ={ // 定义一个分页对象，传到模板引擎
        begin,
        page,
        end,
        total_pages,
        search
      }
      
      res.render('admin/booklist.html', { // 渲染模板引擎
          url: req.url, // 当前的url
          booklistdata: booklistdata, // 当前的所索引的图书 
          categoriesdata: categoriesdata, // 所有的种类
          publishersdata: publishersdata, // 所有的出版社
          query: req.query, 
          pagination: pagination // 分页信息
       })
    ```

    `booklist`前端界面代码摘要：

    ```html
    {{ each booklistdata }}
              <tr>
                <td class="text-center"><input data-id="{{ $value.Id }}" type="checkbox"></td>
                <td><a href="/book-detail?id={{ $value.Id }}">{{ $value.Title }}</a></td>
                <td>{{ $value.Author }}</td>
                <td>{{ $value.publishername }}</td>
                <td class="text-center">{{ $value.PublishDate | dateFormat }}</td>
                <td class="text-center">{{ $value.ISBN }}</td>
                <td class="text-center">{{ $value.UnitPrice }}</td>
                <td class="text-center">
                  <a href="/book-modify?id={{ $value.Id }}" class="btn btn-default btn-xs">编辑</a>
                  <a href="/book-delete?id={{ $value.Id }}" class="btn btn-danger btn-xs">删除</a>
                </td>
              </tr>
     {{ /each }}
    ```

    因为设及到日期，所以要有一个过滤器来处理它(`art-template` 有一个配置对象来帮助我们):

    ```javascript
    app.set('view options',{ // 设置一个全局的过滤器
      imports: {
        dateFormat: function(date){
         var a = new Date( date )
         var y = a.getFullYear()
         var m = a.getMonth() + 1
         var d = a.getDate()
    
         var M = m < 10 ? ('0' + m) : m
         var D = d < 10 ? ('0' + d) : d
    
         return y + '-' + M + '-' + D
       }
      }
    })
    ```

    页面批量删除的实现(`jquery`版本):

    ```javascript
    $(function($){
            var $theadcheckbox=$('thead input')
            var $tbodycheckboxs=$('tbody input')
            var $btndelete=$('#btn_delete')
    
            var allcheckeds=[]
            $tbodycheckboxs.on('change',function(){
              var id=$(this).data('id')
    
              if($(this).prop('checked')){
                allcheckeds.push(id)
              }else {
                allcheckeds.splice(allcheckeds.indexOf(id),1)
              }
              allcheckeds.length ? $btndelete.fadeIn() : $btndelete.fadeOut()
              $btndelete.prop('search','?id='+allcheckeds)
            });
    
            $theadcheckbox.on('change',function(){
              allcheckeds=[]
    
              var checked=$(this).prop('checked')
    
              $tbodycheckboxs.prop('checked', checked).trigger('change')
    
            })
          })
    ```

3. `book-detail`图书单个信息的实现

    路由设计: 

    |     url      | 方式 |  值  |
    | :----------: | :--: | :--: |
    | /book-detail | GET  |  id  |

    这个页面就是数据库根据`id`查找内容的实现

    ```javascript
    db.query(`SELECT books.Id,books.Title,books.Author,publishers.Name as Publishername,books.PublishDate,books.ISBN,
                books.WordsCount,books.UnitPrice,
                books.ContentDescription,books.AurhorDescription,books.EditorComment,books.TOC,
                categories.Name as Categoryname
                FROM books
                INNER JOIN publishers ON publishers.Id=books.PublisherId
                INNER JOIN categories ON categories.Id=books.CategoryId
                WHERE books.Id=${parseInt(req.query.id)}`, function () {}) // 数据库的联合查询
    ```

4. `book-add`图书增加界面的实现

    路由设计: 

    |    url    | 方式 |       值       |
    | :-------: | :--: | :------------: |
    | /book-add | GET  |                |
    | /book-add | POST | 图书的各种信息 |

    因为是`POST` 所以安装 `npm i body-parser ` 依赖项，目的是为了帮助我们解析请求体中的内容，具体配置如下:

    ```javascript
    var bodyParser = require('body-parser')
    
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json()) // 解析以JSON格式存放
    ```

    ```javascript
    db.query(`INSERT INTO books   (Id,Title,Author,PublisherId,PublishDate,ISBN,WordsCount,UnitPrice,
                  ContentDescription,TOC,CategoryId,Clicks)
                  VALUES (${id},'${query.title}','${query.author}',${parseInt(query.publishers)},
                  '${query.publishdate}',
             '${query.ISBN}',${parseInt(query.wordcount)},${parseInt(query.price)},'${query.content}',
                  '${query.toc}',${parseInt(query.category)},0)` , function () {})
    ```

    这个页面最重要的为文件(图片) 的上传 需要安装 `npm i multer `这个依赖项，具体配置如下: 

    ```javascript
    var multer = require('multer')
    var multerObj = multer({dest: './public/upload'}) // 文件上传的文件夹
    
    app.use(multerObj.any()) // 不限文件的格式
    ```

    文件上传代码如下: 

    ```javascript
      var files = req.files
      var ext = pathLib.parse(files[0].originalname).ext // 获取文件的扩展名
      var newFileName = query.ISBN + ext // 新文件以图书的ISBN为名
      var oldPath = files[0].path // 文件的旧的路径名
      var newPath = files[0].destination + '/' + newFileName // 文件新的路径名
      
      // 因为只要文件上传，目标文件夹就有在了，所以要改路径
      fs.rename(oldPath, newPath, function () {}） // 改文件的路径
    ```

5. `book-delete`图书删除接口的实现:

    路由设计:

    |     url      | 方式 |     值     |
    | :----------: | :--: | :--------: |
    | /book-delete | GET  | id或id数组 |

    删除接口最重要的是`sql防注入问题`

    ```javascript
      db.query(`DELETE FROM books WHERE Id in (${id})` ,function (err,data) {
        if (err) {
          return res.status(500).send('database error').end()
        }
        res.redirect(req.headers.referer) // 重定向到上层界面
        })
      })
    ```

6. `book-modify`修改界面的实现:

    路由设计:

    |     url      | 方式 |       值       |
    | :----------: | :--: | :------------: |
    | /book-modify | GET  |       id       |
    | /book-modify | POST | 图书的各种信息 |

    先用`GET`方式获取当前图书的各种信息，渲染到页面上，然后把修改好的图书信息通过`POST`方式传到服务端，然后写进数据库

    ```javascript
    db.query(`UPDATE books SET Title = '${bookmodify.Title}',CategoryId = ${parseInt(bookmodify.Category)},
                Author = '${bookmodify.Author}',PublisherId = ${parseInt(bookmodify.publisher)},
                PublishDate = '${bookmodify.PublishDate}',ISBN = '${bookmodify.ISBN}',
                WordsCount = ${parseInt(bookmodify.WordsCount)},UnitPrice = ${parseInt(bookmodify.UnitPrice)},
                ContentDescription = '${bookmodify.ContentDescription}',
                TOC = '${bookmodify.TOC}'
                WHERE Id = ${parseInt(bookmodify.Id)}`,
      function (err,data) {
        if (err) {
          return res.status(500).send('database error').end()
        }
      res.redirect('/book-detail?id=' + bookmodify.Id) // 重定向到当前修改图书的信息页
      })
    ```

7. `category-publisher`这是图书的种类和出版社界面:

    路由设计:

    |     url     | 方式 |             值             |
    | :---------: | :--: | :------------------------: |
    | /categories | GET  |                            |
    | /categories | GET  | name [category,publisher]  |
    | /categories | POST |  kind[category,publisher]  |
    | /categories | POST | status[category,publisher] |

    因为图书的种类和出版社的`CURD`都在同一个界面，所以逻辑十分复杂，肯定会形成`回调地狱`，在这个路由中使用`Promise`封装成一个函数`getdata`:

    ```javascript
    var getdata = function (query, callback) {
      return new Promise(function (resolve, reject) {
        db.query( query ,function (err,data) {
          if (err) {
            reject(err)
          }
          callback && callback(data)
          resolve(data)
      })
     })
    }
    ```

8. `login`管理员登录页面的实现:

    路由设计:

    |  url   | 方式 |           值           |
    | :----: | :--: | :--------------------: |
    | /login | GET  |                        |
    | /login | POST | 管理员的 name password |

    因为是登录，所以要有一个`session`或者`cookie`来维持登录状态（我这里选择了`session`），`npm i express-session ` 下载相关依赖包：

    ```javascript
    var session = require('express-session')
    
    app.use(session({
      secret: 'mac',  // 密钥
      resave: false,
      saveUninitialized: false
    }))
    ```

    登录界面无非就是表单的验证，前端通过`ajax`把数据传到服务端，服务端再把这些数据进行校验

    服务端代码如下:

    ```javascript
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
    ```

    前端代码如下:

    ```javascript
    $('#login_form').on('submit', function (e) {
          e.preventDefault()
          var formData = $(this).serialize()
          $.ajax({
            url: '/login',
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (data) {
              if(data.error === 1) {
                $('#message').fadeIn()
                $('#message p').html(data.message)
              } else if (data.error ===0) {
                $('#message').fadeIn()
                $('#message p').html(data.message)
                window.location.href = '/'
              }
           }
          })
        })
    ```



### 3. 客户端设计:

1. `index`客户端首页内容的实现:

   + 首页的接口设计:

     - `图书加载更多`接口：

       ```javascript
         var page = req.query.page
         var offset = (page - 1) * size
         db.query(`SELECT Id,Title,Author,ContentDescription,ISBN FROM books LIMIT  ${offset},${size}`,
         function (err,data) {
           if (err) {
             return res.status(500).send('database error').end()
           }
           res.json({
             data
           })
         })
       ```

     - `加入购物车`接口:

       这个接口没有采用数据库保存的方式，而是采用以`json`文件保存的方式

       ```javascript
         if (!req.session['user']) { // 检查用户是否登录
           return res.json({
               error: 1,
               message: '请登录'
             })
         }
         var user_id = parseInt(req.session['user'].Id)  // 获取当前登录用户的id
         var book_id = parseInt(req.query.id)  // 获取所选图书的id
       
         var count = parseInt(req.query.count)  // 获取想要加入购物车图书的数量
       
         var user = req.session['user']
       
         var isuser = false
         var isbook = false
       
         fs.readFile('./data/user-cart.json','utf8', function (err,data) {
           if (err) {
             return res.json({
                 error: 2,
                 message: '加入购物车失败'
               })
           }
             var cart = JSON.parse(data)
       
             var cartobj = {  // 创建一个购物车对象
               user_id: user_id, // 用户id
               cart: [
                 {
                   book_id: book_id, // 图书id
                   count: count, // 图书数量
                   select: false // 是否选择
                 }
               ]
             }
       
             var cartbookobj = {  // 创建一个图书对象
               book_id: book_id,
               count: count,
               select: false
             }
       
             cart.forEach(function (item) { // 查询购物车里有没有当前用户id
               if (item.user_id === user_id) {
                 isuser = true 
                 item.cart.forEach(function (item) {
                   if (item.book_id === book_id) {  // 查询当前用户名中有没有当前所选的书
                     isbook = true
                     item.count += count // 有的话数量加
                   }
                 })
               }
             })
       
             if (isbook === false) {  // 没有图书就push
               cart.forEach(function (item) {
                 if (item.user_id === user_id) {
                   item.cart.push(cartbookobj)
                 }
               })
             } else {
               return res.json({
                 error: 3,
                 message: '你已经添加过啦'
               })
             }
       
             if (isuser === false) { // 没有当前用户id，就push
               cart.push(cartobj)
             }
       
       
             fs.writeFile('./data/user-cart.json',JSON.stringify(cart), function (err) {
               if (err) {
                 return res.json({
                     error: 2,
                     message: '加入购物车失败'
                   })
               }
               res.json({
                 error: 0,
                 message: 'ok'
               })
             })
           })
       ```

   + 然后页面就是各种AJAX 应用


