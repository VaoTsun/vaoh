









function onLoad() {
	loadJSON(
		window.location.origin + '/c?q=tagEnv'
		, function (d,a) {
			drpDown(d,{"holder":"env_drpdwn","id":"id","value":"val"});
			drpDown(d,{"holder":"env_drpdwnH","id":"id","value":"val"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=tagLoc'
		, function (d,a) {
			drpDown(d,{"holder":"loc_drpdwn","id":"id","value":"val"});
			drpDown(d,{"holder":"loc_drpdwnH","id":"id","value":"val"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=hostNames'
		, function (d,a) {
			drpDown(d,{"holder":"hosts_drpdwn","id":"id","value":"hostname"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=serviceTypes'
		, function (d,a) {
			drpDown(d,{"holder":"serviceTypes","id":"id","value":"sname"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

}

window.onload = onLoad;