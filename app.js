
//connect to mongo
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  // yay!
});


//define schema
var kittySchema = mongoose.Schema({
    name: String,
    date: Date
})

var Kitten = mongoose.model('Kitten', kittySchema)
var silence = new Kitten({ name: 'Fluffy', date: Date.now() })
console.log(silence.name) // 'Silence'

kittySchema.methods.speak = function () {
  var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name"
  console.log(greeting);
}


silence.save(function (err, silence) {
  if (err) // TODO handle the error

  silence.speak();
});

Kitten.find(function (err, kittens) {
  if (err) // TODO handle err
  console.log(kittens)

})
/*
Kitten.find({ name: /^Silence/ }, function(err,data){
	console.log(data);	
})
*/

/* xTuple Models*/


var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var _ = require('underscore')
var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

//cat debug
app.get('/cats/:name', function(req,res){
var silence = new Kitten({ name: req.params.name});
silence.save(function (err, silence) {
  if (err) // TODO handle the error
  silence.speak();
});

	res.writeHead('200',{"Content-Type" : "text/html"});
	res.write(req.params.name + " was saved");
	res.end();	
});

app.get('/cats', function(req,res){


Kitten.find({ name: /^Fluffy/ }, function(err,data){

	res.writeHead('200',{"Content-Type" : "text/html"});
	res.write(data);
	res.end();	
})


});

app.get('/xtuple/:barcode', function(req,res){
	/*
	res.render('xtuple', {barcode:req.params.barcode})
	*/
	//res.writeHead('200');
	//res.write(req.params.barcode);
	res.render('xtuple', {barcode:req.params.barcode})	
	res.end();	
});
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
