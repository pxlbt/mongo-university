var express = require('express'),
    app = express(),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert'),
    bodyParser = require('body-parser');

app.set('view engine', 'jade');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect('mongodb://localhost:27017/video', function(err,db){
  assert.equal(null, err);

  app.get('/',function(req,res){
    db.collection('movies').find({}).toArray(function(err,docs){
      res.render('movies', { movies : docs, activeId : req.query.active || false })
    })
  })

  app.get('/movie/:title',function(req,res){
    var title = req.params.title;
    assert.notEqual(false, title);
    db.collection('movies').find({title: title}).toArray(function(err,docs){
      if (docs.length)
        res.render('movie', { movie : docs[0] })
      else
        res.sendStatus(404);
    })
  })

  app.get('/add', function(req,res) {
    res.render('add')
  })

  app.post('/add', function(req,res){
    var title = req.body.title,
        year = req.body.year,
        imdb = req.body.imdb;
    if (title == '' || year == '' || imdb == '') {
      res.render('add', {error: true})
    } else {
      db.collection('movies').insert({title: title, year: year, imdb: imdb}, function(err, data){
        if (data.result.ok) {
          res.redirect('/?active='+data.insertedIds)
        } else {
          res.send('error on added document')
        }
      })
    }
  })

  app.use(function(req,res){
    res.sendStatus(404);
  })

  var server = app.listen(3030, function(){
    var port = server.address().port;
    console.log ('server start on ' + port + ' address')
  })
})
