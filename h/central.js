









function onLoad() {
	loadJSON(
		window.location.origin + '/c?q=tagEnv'
		, function (d,a) {
			drpDown(d,{"holder":"env_drpdwn","id":"id","value":"val"});
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
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=hostNamesRs'
		, function (d,a) {
			drpDown(d,{"holder":"hosts_drpdwnRs","id":"id","value":"hostname"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);
	
	loadJSON(
		window.location.origin + '/c?q=hostNamesAws'
		, function (d,a) {
			drpDown(d,{"holder":"hosts_drpdwnAws","id":"id","value":"hostname"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=hostNamesC8'
		, function (d,a) {
			drpDown(d,{"holder":"hosts_drpdwnC8","id":"id","value":"hostname"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=hostNamesOthers'
		, function (d,a) {
			drpDown(d,{"holder":"hosts_drpdwnOthers","id":"id","value":"hostname"});
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);

	loadJSON(
		window.location.origin + '/c?q=hostNamesFalse'
		, function (d,a) {
			drpDown(d,{"holder":"hosts_drpdwnFalse","id":"id","value":"hostname"});
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