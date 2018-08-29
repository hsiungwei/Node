var express = require('express');
var app = express();
var engine = require('ejs-locals');
var bodyparser = require('body-parser');


var index  = require('./routes/index');


app.engine('eje',engine);
app.set('views','./views');
app.set('view engine','ejs');

app.use(('/hsiung'),express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use('/',index);






app.listen(8080,function () {

  console.log('Server is Running');

});

module.exports = app;