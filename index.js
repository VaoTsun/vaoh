var express = require('express')
	, fs = require('fs')

;
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/raindrops', function(req, res) {
	fs.readFile(__dirname+'/h/raindrops.html',function (err, html){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
        res.write(html);
        res.end();
		//response.send(html);
	})

});



app.get('/', function(req, res) {
	fs.readFile(__dirname+'/h/manitou.test.html',function (err, html){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
        res.write(html);
        res.end();
		//response.send(html);
	})

});
app.get('/*.*', function(req, res) {
	var extension = req.url.split('.')[req.url.split('.').length-1];
	var permit = false;
	
	/*
	fs.readFile(__dirname+'/manitou.test.html',function (err, html){
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':html.length});
        res.write(html);
        res.end();
		//response.send(html);
	})
	*/



	if (['gif','png','jpg','jpeg'].indexOf(extension) >-1 ) {
		var type = 'image/'+extension;
		var bin = 'binary';
		permit = true;
	}
	if (extension == 'html' ) {
		var type = 'text/'+extension;
		var bin = '';
		permit = true;
	}
	if ((extension == 'js' || extension == 'json') && ['/index.js','/gr.js','/config.js','/classifiers.json'].indexOf(req.url) < 0) {
		var type = 'application/javascript';
		var bin = 'binary';
		permit = true;
	}
	if ( permit == true ) {
		fs.readFile(__dirname+'/'+req.url,function (err, data){
			console.log(err);
			if (data) {
				data=String(data)
				res.writeHead(200, {'Content-Type': type,'Content-Length':data.length});
				res.end(data, bin);
				return true;
				} else {
				res.end('file' + req.url+' not found... And you what expected?..');
			}
		})
		return true;
	}
	
	
  
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*
this is for proxy

request('http://'+conf.app.host+':'+conf.app.port+'/'+conf.app.oauth2callback, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	conf.app.console('	::Initiated SSO');
	  }
});
*/