var express = require('express')
	, fs = require('fs')
	, pg = require('pg')
	, q = require(__dirname+'/e/db.js')
;
var app = express();
var go = {
	  "module" : ""
	, "extension" : ""
	, "cut" : {
		  "/" : "/h/title.html"
		, "/raindrops" : "/h/raindrops.html"
		, "/manitou" : "/h/manitou.test.html"
	}
};

function showHtml(_name,res) {
	fs.readFile(_name,function (err, html){
		returnHtml(html,res);
	})
}

function returnHtml (_html,res) {
	res.writeHead(200, {'Content-Type': 'text/html','Content-Length':_html.length});
	res.write(_html);
	res.end();
		//response.send(html);
	return null;
}

function shortLink (req,res) {
	//console.log(JSON.stringify(go));
	if ( go.module == '/db') {
		fs.readFile(__dirname+'/q/'+req.query.q+'.sql',function (err, sql){
			if (err) {
				return console.log(err);
				//return returnHtml(String(err),res);
			}
			var dbe = require(__dirname+'/e/db.js');
			dbe.simpleQuery(String(sql),function() {
					returnHtml(JSON.stringify(dbe.result,null,2),res);
			});
		})
		/*
		*/
		//returnHtml(JSON.stringify(req.query,null,2),res);
		
		return true;
	} 
	if ( typeof(go.cut[go.module]) != 'undefined' ) {
		return showHtml(__dirname+go.cut[go.module],res);
	} 
	returnHtml (req.url+'?.. Not sure what you want me to do... :/',res);
	return null;
}

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get('/*', function(req, res) {
	//console.log(req.connection.remoteAddress,req.headers);
	go.module = req.url.split('?')[0];

	if ( req.connection.remoteAddress != '127.0.0.1' ) {
		q.Q("insert into h_views (t,ip,headers,url) select clock_timestamp(),'"+req.connection.remoteAddress+"','"+JSON.stringify(req.headers, null,2)+"'::json ,'"+req.url+"'",function() {
			return null;
		});
	}

	if (String(req.url).indexOf('.') < 0 ) {
		/*
		if ( req.url == '/db' ) {
			Q("select now(),* from h_views order by t desc limit 9",function() {
				//console.log(JSON.stringify(go.db.rslt, null,2));
				returnHtml (JSON.stringify(go.db.rslt, null,2),res)
			});
		}
		*/
		shortLink (req,res);
		return null;
		} else {
		go.extension = req.url.split('.')[req.url.split('.').length-1];
	
	
		var extension = req.url.split('.')[req.url.split('.').length-1];
		var permit = false;

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
			} else {
			returnHtml (req.url+'?.. What you want me to do?.. :/',res)
			return null;
		}
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