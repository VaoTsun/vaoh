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
		res = result;
		callback();
	  });
	});
}


module.exports = dbe;