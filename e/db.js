var pg = require('pg')

var dbe = {
	  "db" : {
		  "host" : "ec2-54-83-43-118.compute-1.amazonaws.com"
		, "name" : "d7phfnujevb7sf"
		, "port" : "5432"
		, "user" : "ecebcdmrniewwx"
		, "pass" : "yVvbUsSu5CFULxc8PuvXL_AqD_"
	}
	, simpleQuery : function(_s,_c) {return Q(_s,_c);} 
	, privateSegmentQuery : function(_s,_c) {return cQ(_s,_c);} 
};

function Q(_s,callback) {
	/* async, vulnerable, simple */
	var conString = "postgres://"+dbe.db.user+":"+dbe.db.pass+"@"+dbe.db.host+":"+dbe.db.port+"/"+dbe.db.name+"?ssl=true";
	pg.connect(conString, function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
	  //client.query('SELECT $1::int AS number', ['1'], function(err, result) {
	  client.query(_s, function(err, result) {
		done();//call `done()` to release the client back to the pool
		if(err) {
		  return console.error('error running query', err);
		}
		dbe.result = result;
		//console.log(JSON.parse(result.setEncoding('utf8');));
		callback();
	  });
	});
}

function cQ(_s,callback) {
	/* async, vulnerable, simple */
	var conString = "postgres://"+dbe.central.user+":"+dbe.central.pass+"@"+dbe.central.host+":"+dbe.central.port+"/"+dbe.central.name+"?ssl="+dbe.central.ssl;
	console.log(_s);
	pg.connect(conString, function(err, client, done) {
	  if(err) {
		return console.error('error fetching client from pool', err);
	  }
	  //client.query('SELECT $1::int AS number', ['1'], function(err, result) {
	  client.query(_s, function(err, result) {
		done();//call `done()` to release the client back to the pool
		if(err) {
		  console.error('ERRor running query:: ', err.detail);
		  dbe.err = err;
		}
		dbe.result = result;
		//console.log(JSON.parse(result.setEncoding('utf8');));
		callback();
	  });
	});
}


module.exports = dbe;