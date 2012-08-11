
/**
 * Module dependencies.
 */

var express = require('express'),
	routes = require('./routes'),
	partials = require('express-partials'),
	http = require('http');

var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');

  app.use(partials());

  //app.set('view engine', 'jade');
  // map .renderFile to ".html" files
  app.engine('html', require('ejs').renderFile);

  // make ".html" the default
  app.set('view engine', 'html');


  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/api/pubs', routes.api.pubs);
app.get('/api/pubs/:id', routes.api.pub_by_id);
app.put('/api/pubs/:id', routes.api.pub_update);
app.post('/api/pubs', routes.api.pub_create);
app.delete('/api/pubs/:id', routes.api.pub_delete);

app.get('/api/pubs/near/:lon/:lat', routes.api.pubs_near)
app.get('/api/pubs/distances/:lon/:lat', routes.api.pubs_near_with_distances)


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
