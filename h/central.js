
v.scenarios.newHost = {
		  "land": document.getElementById("newHostDiv")
		, "steps": [
			{
	 			 "land": document.getElementById("newHostDiv")
				, "lag": 5
				, "act": function() {
					this.land.innerHTML='';
					this.land.style.backgroundColor = '#ddccbb';
					this.land.style.border = '3px purple double';
					this.land.style.width = '900px';
					this.land.style.height = '70px';
					DropDownSet({
						  "id":"addHostProp"
						, "land": "newHostDiv"
						, "arr":[
							  {  "s":"location:"
							  	, "src":"tagLoc"
							  	, "j":{
							  		  "holder":"n_loc_drpdwn"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
									}
							}
							 , {  "s":"hostname: "
							  	, "src":''
							  	, "j":{
							  		  "holder":"nhn"
							  		, "id":"id"
							  		, "value":"val"
									}
							}
							 , {  "s":""
							  	, "src":''
							  	, "j":{
							  		  "holder":"nhab"
							  		, "id":"id"
							  		, "value":"val"
									}
							}
						]
					}
					);
					document.getElementById('nhn').innerHTML='<input id="new_hostname" style="width:300px;" value="portal.odobo.com"> ';
					document.getElementById('nhab').innerHTML='<input type="button" onclick="add_hostname();" value="add">';
					var st = document.createElement("DIV");
					st.id = "sql_state";
					st.style.color = "white";
					st.style.backgroundColor = "brown";
					document.getElementById("newHostDiv").appendChild(st);
				}
			}
			]
	}
;
v.scenarios.editHost = {
	"steps": [
			{
	 			 "land": document.getElementById("editHostDiv")
				, "lag": 05
				, "act": function() {
					this.land.innerHTML='';
					this.land.innerHTML='';
					this.land.style.backgroundColor = '#ddbbcc';
					this.land.style.border = '3px purple double';
					this.land.style.width = '900px';
					this.land.style.height = '150px';
					v.wa.n = 1;
				}
			}
			, {
				  "land": document.getElementById("editHostDiv")
				, "lag": 10
				, "act": function() {
					var p = document.createElement("P");
					p.innerHTML = 'Select a host to change property of:';
					document.getElementById('editHostDiv').appendChild(p);
					DropDownSet({
						  "id":"hostsDiv"
						, "land": "editHostDiv"
						, "arr":[
							  {"s":"Rackspace:","src":"hostNamesRs","j":{
							  	"holder":"hosts_drpdwnRs","id":"id","value":"hostname"
									, "onch" : function() {
										getHostProp(this.value);
									}
								}
							}
							, {"s":"Amazon:","src":"hostNamesAws","j": {
									 "holder":"hosts_drpdwnAws"
									, "id":"id"
									, "value":"hostname"
									, "onch" : function() {
										getHostProp(this.value);
									}
								}
							}
							, {"s":"Continent 8:","src":"hostNamesC8","j":{
								"holder":"hosts_drpdwnC8","id":"id","value":"hostname"
									, "onch" : function() {
										getHostProp(this.value);
									}
								}
							}
							, {"s":"Others:","src":"hostNamesOthers","j":{
								"holder":"hosts_drpdwnOthers","id":"id","value":"hostname"
									, "onch" : function() {
										getHostProp(this.value);
									}
								}
							}
							, {"s":"Obsolete:","src":"hostNamesFalse","j":{
								"holder":"hosts_drpdwnFalse","id":"id","value":"hostname"
									, "onch" : function() {
										getHostProp(this.value);
									}
								}
							}
						]
					}
					);
					var h = document.createElement("DIV");
					h.id="changeHost";
					this.land.appendChild(h);
					
					DropDownSet({
						  "id":"changeHostProp"
						, "land": "editHostDiv"
						, "arr":[
							  {  "s":"Location:"
							  	, "src":"tagLoc"
							  	, "j":{
							  		  "holder":"loc_drpdwn"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
											
										}
									}
							}
							, {  "s":"State:"
							  	, "src":"trueFalseNull"
							  	, "j":{
							  		  "holder":"tf_drpdwn"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
										}
									}
							}
							, {  "s":""
							  	, "src":""
							  	, "j":{
							  		  "holder":"changeButton"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
										}
									}
							}
						]
					}
					);
					//document.getElementById('loc_drpdwn').setAttribute('disabled',true);//  input.removeAttribute('disabled');
					document.getElementById('changeHostProp').style.display='none';
					document.getElementById('changeButton').innerHTML='<input type=button value="change">';
					document.getElementById('changeButton').onclick = function () {
						var e = document.getElementById('loc_drpdwn').children[0];
						var r = ''
							+ e.options[e.selectedIndex].value
							+ ' : '
							+ document.getElementById('tf_drpdwn').children[0].value
							+ ' : '
							+ v.wa.form.hostname;
						//console.log(r);
						document.getElementById('changeHostProp').style.display='none';
						cng_hostname();
					}
					var st = document.createElement("DIV");
					st.id = "sqle_state";
					st.style.color = "white";
					st.style.backgroundColor = "brown";
					document.getElementById("editHostDiv").appendChild(st);
				}
			}
			]
			
	}
;
v.scenarios.addService = {
	"steps": [
			{
	 			 "land": document.getElementById("addService")
				, "lag": 05
				, "act": function() {
					this.land.innerHTML='';
					this.land.innerHTML='';
					this.land.style.backgroundColor = '#bbddcc';
					this.land.style.border = '3px purple double';
					this.land.style.width = '900px';
					this.land.style.height = '150px';
					v.wa.n = 1;
				}
			}
			, {
				  "land": document.getElementById("addService")
				, "lag": 10
				, "act": function() {
					var p = document.createElement("P");
					p.innerHTML = 'Select a host to add a service at:';
					document.getElementById('addService').appendChild(p);
					DropDownSet({
						  "id":"s_hostsDiv"
						, "land": "addService"
						, "arr":[
							  {"s":"All:","src":"hostNames","j":{
							  	"holder":"hostNames","id":"id","value":"hostname"
								}
							}
							,{"s":"Rackspace:","src":"hostNamesRs","j":{
							  	"holder":"s_hosts_drpdwnRs","id":"id","value":"hostname"
								}
							}
							, {"s":"Amazon:","src":"hostNamesAws","j": {
									 "holder":"s_hosts_drpdwnAws"
									, "id":"id"
									, "value":"hostname"
								}
							}
							, {"s":"Continent 8:","src":"hostNamesC8","j":{
								"holder":"s_hosts_drpdwnC8","id":"id","value":"hostname"
								}
							}
							, {"s":"Others:","src":"hostNamesOthers","j":{
								"holder":"s_hosts_drpdwnOthers","id":"id","value":"hostname"
								}
							}
						]
					}
					);
					var p = document.createElement("P");
					p.innerHTML = 'Select an environment tag and service type to add a service to:';
					document.getElementById('addService').appendChild(p);
					DropDownSet({
						  "id":"changeHostProp"
						, "land": "addService"
						, "arr":[
							  {  "s":"Environment:"
							  	, "src":"tagEnv"
							  	, "j":{
							  		  "holder":"env_drpdwn"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
											
										}
									}
							}
							, {  "s":"Type:"
							  	, "src":"serviceTypes"
							  	, "j":{
							  		  "holder":"serviceTypes"
							  		, "id":"id"
							  		, "value":"sname"
									}
							}
							, {  "s":""
							  	, "src":""
							  	, "j":{
							  		  "holder":"changeButton"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
										}
									}
							}
						]
					}
					);
					//document.getElementById('loc_drpdwn').setAttribute('disabled',true);//  input.removeAttribute('disabled');
					document.getElementById('changeHostProp').style.display='none';
					document.getElementById('changeButton').innerHTML='<input type=button value="change">';
					document.getElementById('changeButton').onclick = function () {
						var e = document.getElementById('loc_drpdwn').children[0];
						var r = ''
							+ e.options[e.selectedIndex].value
							+ ' : '
							+ document.getElementById('tf_drpdwn').children[0].value
							+ ' : '
							+ v.wa.form.hostname;
						//console.log(r);
						document.getElementById('changeHostProp').style.display='none';
						cng_hostname();
					}
					var st = document.createElement("DIV");
					st.id = "sqle_state";
					st.style.color = "white";
					st.style.backgroundColor = "brown";
					document.getElementById("editHostDiv").appendChild(st);
				}
			}
			]
			
	}
;
v.scenarios.modifyService = {
	"steps": [
			{
	 			 "land": document.getElementById("modifyService")
				, "lag": 05
				, "act": function() {
					this.land.innerHTML='';
					this.land.innerHTML='';
					this.land.style.backgroundColor = '#bbccdd';
					this.land.style.border = '3px purple double';
					this.land.style.width = '900px';
					this.land.style.height = '150px';
					v.wa.n = 1;
				}
			}
			, {
				  "land": document.getElementById("modifyService")
				, "lag": 10
				, "act": function() {
					var p = document.createElement("P");
					p.innerHTML = 'Select a host to add a service at:';
					document.getElementById('modifyService').appendChild(p);
					DropDownSet({
						  "id":"m_hostsDiv"
						, "land": "modifyService"
						, "arr":[
							  {"s":"All:","src":"hostNames","j":{
							  	"holder":"m_hostNames","id":"id","value":"hostname"
								}
							}
							,{"s":"Rackspace:","src":"hostNamesRs","j":{
							  	"holder":"m_hosts_drpdwnRs","id":"id","value":"hostname"
								}
							}
							, {"s":"Amazon:","src":"hostNamesAws","j": {
									 "holder":"m_hosts_drpdwnAws"
									, "id":"id"
									, "value":"hostname"
								}
							}
							, {"s":"Continent 8:","src":"hostNamesC8","j":{
								"holder":"m_hosts_drpdwnC8","id":"id","value":"hostname"
								}
							}
							, {"s":"Others:","src":"hostNamesOthers","j":{
								"holder":"m_hosts_drpdwnOthers","id":"id","value":"hostname"
								}
							}
						]
					}
					);	// <-- hosts
					/*					*/

					var p = document.createElement("P");
					p.innerHTML = 'Select an environment tag and service type to add a service to:';
					document.getElementById('modifyService').appendChild(p);
					DropDownSet({
						  "id":"changeHostProp"
						, "land": "modifyService"
						, "arr":[
							  {  "s":"Environment:"
							  	, "src":"tagEnv"
							  	, "j":{
							  		  "holder":"m_env_drpdwn"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
									}
							}
							, {  "s":"Type:"
							  	, "src":"serviceTypes"
							  	, "j":{
							  		  "holder":"m_serviceTypes"
							  		, "id":"id"
							  		, "value":"sname"
										, "onch" : function() {
											StandartCall({"i":"wholeFarmD","args":"&services_type="+this.options[this.selectedIndex].text});
										}
									}
							}
							, {  "s":""
							  	, "src":""
							  	, "j":{
							  		  "holder":"changeButton"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
										}
									}
							}
						]
					}
					);
					/*
					
					*/
					DropDownSet({
						  "id":"listServices"
						, "land": "modifyService"
						, "arr":[
							  {  "s":"listServicesFull:"
							  	, "src":"wholeFarmD"
							  	, "j":{
							  		  "holder":"serv"
							  		, "id":"services_id"
							  		, "value":"service\:utf"
							  		, "nullVal":' '
										, "onch" : function() {
											console.log(this.value);
										}
									}
							}
							, {  "s":""
							  	, "src":""
							  	, "j":{
							  		  "holder":"m_changeButton"
							  		, "id":"id"
							  		, "value":"val"
							  		, "nullVal":' '
										, "onch" : function() {
										}
									}
							}
						]
					}
					);
					
					//document.getElementById('loc_drpdwn').setAttribute('disabled',true);//  input.removeAttribute('disabled');
					//document.getElementById('changeHostProp').style.display='none';
					
					document.getElementById('m_changeButton').innerHTML='<input type=button value="change">';
					document.getElementById('m_changeButton').onclick = function () {
						var e = document.getElementById('loc_drpdwn').children[0];
						var r = ''
							+ e.options[e.selectedIndex].value
							+ ' : '
							+ document.getElementById('tf_drpdwn').children[0].value
							+ ' : '
							+ v.wa.form.hostname;
						//console.log(r);
						//document.getElementById('changeHostProp').style.display='none';
						cng_hostname();
					}
					var st = document.createElement("DIV");
					st.id = "m_sql_state";
					st.style.color = "white";
					st.style.backgroundColor = "brown";
					document.getElementById("modifyService").appendChild(st);
					
				}
			}
			]
			
	}
;

function DropDownSet(j) {
	var table = document.createElement("TABLE");
		var tr = document.createElement("TR");
		j.arr.forEach(
			function(element, index, array) {
				var td = document.createElement("TD");
				var h = document.createElement("I");
					h.innerHTML = element.s;
					td.appendChild(h);
				var h = document.createElement("BR");
					td.appendChild(h);
				var h = document.createElement("U");
					h.id = element.j.holder;
					h.onchange = "formateNewService(this);"
				td.appendChild(h);
				tr.appendChild(td);
			}
		);
		table.appendChild(tr);

	var h = document.createElement("DIV");
	h.id = j.id;
	h.style.whiteSpace = 'nowrap;';
	h.style.width = '600px;';
	var l = document.getElementById(j.land);
	table.id = j.id;
	l.appendChild(table);

	j.arr.forEach(
		function(element, index, array) {
			if (!v.wa.consumers[element.src]) {
				v.wa.consumers[element.src] = [];
			}
			v.wa.consumers[element.src].push(element.j);
			drpDown(localStorage.getItem(element.src),element.j);
		}
	);

}

function stepBy(j) {
	//console.log(j);
	j.steps.forEach(
		function(element, index, array) {
			//console.log(element.lag);
			setTimeout(
				function () {
				 	element.act();
				}
				, element.lag
			);
			
		}
	);
}


function StandartCall(j) {
	if( typeof(j.args) == 'undefined' ) {
		j.args = '';
	}
	var url = window.location.origin + '/c?q='+j.i+j.args;
	console.log(url);
	loadJSON(
		  url
		, function (d,a) {
			var json = IsJsonString(d);
			d = dataComplicated(json.obj);
			localStorage.setItem(j.i,JSON.stringify(d));
			if (v.wa.consumers[j.i]) {
				v.wa.consumers[j.i].forEach(
					function(element, index, array) {
						document.getElementById(element.holder).innerHTML='';
						drpDown(localStorage.getItem(j.i),element);
					}
				);
			}
		}	
		, function () {
			console.log('err');
		}	
		, {"mime":"json"}
	);

}

function onLoad() {
	
	StandartCall({"i":"tagEnv","j":{"holder":"env_drpdwn","id":"id","value":"val","nullVal":' '}});
	StandartCall({"i":"tagLoc","j":{"holder":"loc_drpdwn","id":"id","value":"val","nullVal":' '}});
	StandartCall({"i":"trueFalseNull","j":{"holder":"tf_drpdwn","id":"id","value":"val"}});
	StandartCall({"i":"hostNames"});	
	StandartCall({"i":"wholeFarmD"});
	StandartCall({"i":"hostNamesRs","j":{"holder":"hosts_drpdwnRs","id":"id","value":"hostname"}});
	StandartCall({"i":"hostNamesAws","j":{"holder":"hosts_drpdwnAws","id":"id","value":"hostname"}});
	StandartCall({"i":"hostNamesC8","j":{"holder":"hosts_drpdwnC8","id":"id","value":"hostname"}});
	StandartCall({"i":"hostNamesOthers","j":{"holder":"hosts_drpdwnOthers","id":"id","value":"hostname"}});
	StandartCall({"i":"hostNamesFalse","j":{"holder":"hosts_drpdwnFalse","id":"id","value":"hostname"}});
	StandartCall({"i":"serviceTypes","j":{"holder":"serviceTypes","id":"id","value":"sname"}});
	stepBy(v.scenarios.newHost);
	stepBy(v.scenarios.editHost);
	stepBy(v.scenarios.addService);
	stepBy(v.scenarios.modifyService);
}


window.onload = onLoad;
function cng_hostname() {
	var loc = document.getElementById('loc_drpdwn').children[0].value;
	var tfn = document.getElementById('tf_drpdwn').children[0].value;
	
	loadJSON(
		window.location.origin + '/c?q=updateHostNames&hostname='+encodeURIComponent(v.wa.form.hostname)+'&loc_drpdwn='+loc+'&tf_drpdwn='+tfn
		, function (d,a) {
			//var d = JSON.parse(d);
			
			var s = document.getElementById('sqle_state');
			if (d.rows[0] && d.rows[0].str && d.rows[0].str.substr(0,5) == 'ERROR') {
				d.detail = d.rows[0].str;
				//console.log(d.rows[0].str.substr(0,5));
			}
			if (d.detail) {
				s.style.border = '2px orange solid';
				s.style.backgroundColor = 'brown';
				s.style.color = 'orange';
				s.innerHTML=d.detail;
			}
			if (!d.detail && d.rowCount) {
				s.style.border = '2px purple solid';
				s.style.backgroundColor = 'green';
				s.style.color = 'blue';
				s.innerHTML=d.rows[0].ts+': '+d.rows[0].str;
				//console.log(d);
			}
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);
	onLoad();
}

function add_hostname() {
	var v = document.getElementById('new_hostname').value;
	var loc = document.getElementById('n_loc_drpdwn').children[0].value;
	
	loadJSON(
		window.location.origin + '/c?q=insertHostname&hostname='+encodeURIComponent(v)+'&n_loc_drpdwn='+loc
		, function (d,a) {
 			//var d = JSON.parse(d);
			
			var s = document.getElementById('sql_state');
			if (document.getElementById('new_hostname').value.length < 5 ) {
				s.style.border = '2px orange solid';
				s.style.backgroundColor = 'red';
				s.style.color = 'orange';
				s.innerHTML='value too short to be hostname';
				return false;
			}
			if (d.rows[0] && d.rows[0].str && d.rows[0].str.substr(0,5) == 'ERROR') {
				d.detail = d.rows[0].str;
				//console.log(d.rows[0].str.substr(0,5));
			}
			if (d.detail) {
				s.style.border = '2px orange solid';
				s.style.backgroundColor = 'brown';
				s.style.color = 'orange';
				s.innerHTML=d.detail;
			}
			if (!d.detail && d.rowCount) {
				s.style.border = '2px purple solid';
				s.style.backgroundColor = 'green';
				s.style.color = 'blue';
				s.innerHTML=d.rows[0].ts+': '+d.rows[0].str;
				//console.log(d);
			}
		}	
		, function () {
			console.log('err');
		}	
		, {}
	);
	
}

/*
*/