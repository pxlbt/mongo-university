var express = require('express'),
    app = express(),
    engines = require('consolidate');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname+'/views');

app.get('/',function(req,res){
  res.render('hello', {name: 'templates'});
})

app.use(function(req,res){
  res.sendStatus(404);
})

var server = app.listen(3030, function(){
  var port = server.address().port;
  console.log ('server start on ' + port + ' address')
})
