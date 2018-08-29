var express = require('express');
var router = express.Router();
var sql = require('../config/db');

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;



//首頁,讀取資料
router.get('/',function (req,res) {

    var connect = new Connection(sql);

    connect.on('connect',function (err) {
        if (err)
            console.log(err)

        else {

            console.log('loadding server');
            executeStatement();
        }


    });

    var dataRect = [];

    function executeStatement() {
        var request = new Request("SELECT * FROM phoneBOOK", function(err,rowCount) {
            if (err) {
                console.log(err);
            }else {
                console.log('---------rowcount:' + rowCount);
                res.render('index', {
                    data:dataRect
                });

            }
        });

        request.on('row',function (items) {
            var rowData = {};
            items.forEach(function (item) {

                rowData[item.metadata.colName] = item.value;

            });

            dataRect.push(rowData);

        });

        connect.execSql(request);
    };


});

//進入到新增頁面.
router.get('/add',function (req,res) {
    res.render('New account',{
        route:'add'
    });
});

//送出資料表單.
router.post('/add',function (req,res) {


    var conncet = new Connection(sql)

    conncet.on('connect',function (err) {

        if (err) {
        }else {
            console.log('saving')
             saveStatement();
        }

        function saveStatement() {
            var requset = new Request('INSERT INTO phoneBOOK(name, number, email, address)' + 'VALUES (@name,@number,@email,@address)',function (err) {

                if (err) {
                    console.log(err);
                }
            });

            requset.addParameter('name',TYPES.NVarChar,req.body.name);
            requset.addParameter('number',TYPES.NVarChar,req.body.number);
            requset.addParameter('email',TYPES.NVarChar,req.body.email);
            requset.addParameter('address',TYPES.NVarChar,req.body.address);

            requset.on('row',function (items) {
                items.forEach(function (item) {
                    if (item.value === null){
                        console.log('null');
                    }else {
                        console.log('inserted item is' + item.value);
                    };

                });

            });

            conncet.execSql(requset);
        };

    });

    res.redirect('/');

});

//找到刪除的id並刪除.
router.get('/delete/:id',function (req,res) {



    var connect = new Connection(sql);

    connect.on('connect',function (err,Count) {
        if (err) {
            console.log(err);
        } else  {

            console.log('===============>Count:' + Count);
            console.log('delete Server');
              deleteUser();
            };
    });



    function deleteUser() {

        var request = new Request('DELETE FROM phoneBOOK WHERE id=' + req.params.id  ,function (err) {
            if (err) {
                console.log(err);

            }else {

                console.log('delete connect')

            }

            request.addParameter('id',TYPES.Int, req.params.id);

        });

        console.log(request);

        connect.execSql(request);
        res.redirect('/');

    };


});

//找到需要編輯的id資料.
router.get('/edit/:id/',function (req,res) {

      var coonnect = new Connection(sql);
      coonnect.on('connect',function (err) {
          if (err) console.log(err);
           edit();
      });

      var dataRect =[];

      function edit() {
          var request = new Request('SELECT * FROM phoneBOOK WHERE id=' + req.params.id,function (err,result) {
             if (err) {
                 console.log(err)
             }else {
                 res.render('edit',{
                     data:dataRect,
                     router:'edit'
                 });
             }

          });

          request.on('row',function (items) {
             var rowData = {};
             items.forEach(function (item) {
                 rowData[item.metadata.colName] = item.value;
             });

             dataRect.push(rowData);
             console.log(dataRect);

          });

          coonnect.execSql(request);

      }

});


//傳送更新的資料
router.post('/update',function (req,res) {

    var connect = new Connection(sql);

    connect.on('connect', function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('update');
            update();
        };

    });

    function update() {

        var request = new Request('UPDATE phoneBOOK SET name=@name,number=@number,email=@email,address=@address where id=@id' , function (err) {
            if (err) {
                console.log(err);
            }else {

                res.render('index');
            }
        });
            request.addParameter('id',TYPES.Int,req.body.id);
            request.addParameter('name', TYPES.NVarChar, req.body.name);
            request.addParameter('number', TYPES.NVarChar, req.body.number);
            request.addParameter('email', TYPES.NVarChar, req.body.email);
            request.addParameter('address', TYPES.NVarChar, req.body.address);

            request.on('row', function (items) {
                items.forEach(function (item) {
                    if (item.value === null) {
                        console.log('null');
                    }else {
                        console.log('inserted item is' + item.value);
                    }

                });

        });
        console.log(request);

        connect.execSql(request);
        res.redirect('/');

    };


});

module.exports = router;