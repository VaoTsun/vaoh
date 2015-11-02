var express = require('express')
	, fs = require('fs')
	, pg = require('pg')
	, q = require(__dirname+'/e/db.js')
	, mq = require(__dirname+'/e/mg.js')
;
var app = express();
var types = require('pg').types
types.setTypeParser(20, function(val) {
  //remember: all values returned from the server are either NULL or a string
  return val === null ? null : parseInt(val)
})

/*
var moment = require('moment')
var TIMESTAMPTZ_OID = 1114
var TIMESTAMP_OID = 1184
var parseFn = function(val) {
   return val === null ? null : moment(val)
}
types.setTypeParser(TIMESTAMPTZ_OID, parseFn)
types.setTypeParser(TIMESTAMP_OID, parseFn)
*/
//psql -c "select typname, oid, typarray from pg_type where typtype = 'b' order by oid"

/*
	when db result contains utf stringify or smth else cuts the length or data itself...
	so I just convirt it to hex as a bycicle
	http://stackoverflow.com/questions/21647928/javascript-unicode-string-to-hex
*/
String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}
String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

var go = {
	  "module" : ""
	, "extension" : ""
	, "cut" : {
		  "/" : "/h/title.html"
		, "/clicks" : "/h/table.html"
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
	if ( go.module == '/proxy') {
		console.log(req.query.url,req.url);
		var request = require('request');
		request(decodeURIComponent(req.query.url), function (error, response, body) {
			  if (!error && response.statusCode == 200) {
				returnHtml (body,res);
				} else {
				returnHtml (JSON.stringify({"url":req.url,"err":error,"resp": response},null,2),res);
			  }
		});
		
		return true;
	} 
	if ( go.module == '/timestamp') {
		console.log(mq);
		var d = new Date;
		returnHtml (JSON.stringify({"ts":d.getTime(),"obj":d}),res);
		return true;
	} 
	if ( go.module == '/db') {
		fs.readFile(__dirname+'/q/'+req.query.q+'.sql',function (err, sql){
			if (err) {
				return console.log(err);
				//return returnHtml(String(err),res);
			}
			var dbe = require(__dirname+'/e/db.js');
			dbe.simpleQuery(String(sql),function() {
			
				var k = Object.keys(dbe.result.rows[0]);
				var hexNeeded = false;
				for (var e = 0; e<k.length; e++) {
					if (k[e].slice(-4) == ':utf') {
						hexNeeded = true;
						console.log('utf string alerted in "'+k[e]+'" => preprocessing data internally');
					}				
				}
				if (hexNeeded) {
					console.log('utf string alerted => preprocessing data internally');
					for (var i = 0; i<dbe.result.rows.length; i++) {
						for (var e = 0; e<k.length; e++) {
							if (k[e].slice(-4) == ':utf') {
								dbe.result.rows[i][k[e]] = dbe.result.rows[i][k[e]].hexEncode();
								//console.log(dbe.result.rows[i][k[e]].hexEncode());
							}				
						}
					}
					console.log(i + ' rows parsed');
				}
				
				returnHtml(JSON.stringify(dbe.result,null,2),res);
			});
		})
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

	if ( ['127.0.0.1',"10.0.36.1","10.0.64.5"].indexOf(req.connection.remoteAddress) < 0 ) {//

		q.simpleQuery("insert into h_views (t,ip,headers,url) select clock_timestamp(),'"+req.connection.remoteAddress+"','"+JSON.stringify(req.headers, null,2)+"'::json ,'"+req.url+"'",function() {
			return null;
		});
	}

	if (String(req.url).indexOf('.') < 0 /* (|| String(req.url).split(".").length - 1) */ || String(req.url).indexOf('/proxy') > -1) {
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
			var bin = '';
			permit = true;
		}
		if ( permit == true ) {
			fs.readFile(__dirname+'/'+req.url,function (err, data){
				console.log(err);
				if (data) {
					if (type == 'application/javascript') {
						data=String(data);
					}
					res.writeHead(200, {'Content-Type': type,'Content-Length':data.length});
					res.end(data, bin);
// 					/console.log(data);
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