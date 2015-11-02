var v = {
	"wa" : {
		"clearOnWscape":  ["historyOfChangesDisplayed","Menu","Orig","mainRun"]
	}
	, "sett" : {
		  "hideInfoInterval" : 700
		, "bGc" : "white" 
		, "calmBackgoundColor" : "#343434" 
		, "gridWidth" : 110
		, "gridHeight" : 110
		, "gridX" : 8
		, "gridY" : 5
		, "histSets" : []
		, "updatedBorder": "#c8f3b4"
		, "alertBackground": '#330000'
		, "defaultHistChangesSteps" : 969
		, "defaultHistorySteps" : 89
	}
	, "hist" : {}
	, "histChanges" : {}
	, "runTime" : {"initiated":null,"errors":[]}
};

function loadJSON(path, success, error, app) {
	var startTime = new Date().getTime();
	var xhr = new XMLHttpRequest();
	var data;

	xhr.onreadystatechange = function() {
		app = null;
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				if (success)
					success(xhr.responseText, app);
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

function hNumber(n) {
	return {"orig":n,"coma":n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "<b style=\"opacity:0.4;font-size:10px;\">,</b>")};
}

function seconds(id) {
	v.wa[id].s++;
	//document.getElementById("r_"+id).innerHTML=v.wa[id].s;
	document.getElementById(id+"_tb").innerHTML = '' 
		+ v.wa[id].interval
		+ ':'
		+ v.wa[id].s
	;
	//document.getElementById("r_"+id).style.color = v.wa[id].goodColor;
	//setTimeout(function() {document.getElementById("r_"+id).style.color = v.sett.bGc;},300);
	
	v.wa[id].toMinute = setTimeout(
		function() {
			seconds(id);
		}
		,1*1000
	);
}

function getNextFreeCell(id) {
	//var rid = null;
	var t = document.getElementById(id);
	if (!t) {
		var a = id.replace("grid_cell_","").split("x");
		var checkid = "grid_cell_"+Number(1+parseInt(a[0]))+"x"+Number(1);
		var check = document.getElementById(checkid);
		if (check) {
			//console.log('::'+id,'maybe: ' + checkid);
			return getNextFreeCell(checkid);
			} else {
			console.log('give-up...');
			return false;
		}
	}
	t = t.innerHTML;
	if (t.length > 49) {
		var a = id.replace("grid_cell_","").split("x");
		//console.log(t.length + ' => next: ');
		getNextFreeCell("grid_cell_"+a[0]+"x"+Number(1+parseInt(a[1])));
		} else {
		rid = id;
		//console.log('return: '+rid);
	}
	return rid;
}

function resetOrder() {
	localStorage.setItem('v.wa.currents',null);
	//document.getElementById("theGrid").innerHTML='';
	//drawGridTable();
}

function initStats(o) {
	var s = JSON.parse(localStorage.getItem('v.wa.currents'));
	if (s != null && s[o.id]) {
		if (s[o.id].interval) {
			o.interval = s[o.id].interval;
			o.app.etalon = s[o.id].app.etalon;
			o.app.where = s[o.id].app.where;
			} else {
			v.wa[o.id].interval = o.interval;
		}
	}
	if (!o.app.where) {
		o.app.where = getNextFreeCell("grid_cell_1x1");
	}
	useGridCell(o.app.where,o.id);

	v.wa[o.id] = new Object(o);
	v.wa[o.id].s = 0;
	v.wa[o.id].hostName = getLocation(o.url).hostname;
	v.wa[o.id].origUrl = v.wa[o.id].url;
	v.wa[o.id].url = "http://"+window.location.host+"/proxy?url=" + encodeURIComponent(o.url);
	document.getElementById(o.id+"_ib").innerHTML = '<u style="font-size:8px;color:brown;">'+v.wa[o.id].hostName+'</u>';
	//v.wa[o.id].lastAnalyze = o.initValue;
	//v.wa[o.id].goodColor = o.goodColor || "green";
	
	freshStats(o);

	v.sett.histSets[o.id] = {"steps":v.sett.defaultHistorySteps};
	v.sett.histSets[o.id] = {"histChangesSteps":v.sett.defaultHistChangesSteps};
	
	v.hist[o.id] = new Array();
	v.histChanges[o.id] = JSON.parse(localStorage.getItem('v.histChanges["'+o.id+'"]')) || new Array();
	
	if (o.attr && o.attr.icon) {
		document.getElementById(o.id+"_i").src = "../i/"+o.attr.icon;
	}
	if (o.attr && o.attr.icon) {
	
	var p = document.getElementById(o.id+"_sett");
		var div = document.createElement('DIV');
			var img = document.createElement('IMG');
				img.onclick = mousePosition;
				img.src = '../i/sett.gif';
				img.onclick = mousePosition;
				img.style.width = '20px';
				img.title="settings";
			div.appendChild(img);
			div.onclick = function () {
				showSettings(o.id);
			}
			div.style.width = '33%';
			div.style.float = 'left';
			div.style.height = '18px';
			div.style.width = '18px';
			div.style.paddingRight = '2px';
	p.appendChild(div);

		var hdiv = document.createElement('DIV');
			hdiv.id = 'hdq_'+o.id;
			hdiv.onclick = function () {
				toggleHistory(o.id);
			}
			var himg = document.createElement('IMG');
				himg.onclick = mousePosition;
				himg.title="history";
				himg.src = '../i/dbook.png';
				himg.style.width = '24px';
			hdiv.appendChild(himg);
			hdiv.style.width = '33%';
			hdiv.style.float = 'left';
			hdiv.style.height = '18px';
			hdiv.style.width = '18px';
			hdiv.style.paddingRight = '4px';
	p.appendChild(hdiv);

		var div = document.createElement('DIV');
			div.onclick = function () {
				toggleOnlineState(o.id);
			}
			var img = document.createElement('IMG');
				img.onclick = mousePosition;
				img.title="history";
				img.src = '../i/eye.gif';
				img.style.width = '24px';
			div.appendChild(img);
			//div.style.width = '33%';
			div.style.float = 'left';
			div.style.height = '18px';
			div.style.width = '18px';
			div.style.paddingRight = '2px';
			//div.innerHTML='<a href="'+v.wa[o.id].origUrl+'">'+v.wa[o.id].origUrl+'</a>';
	p.appendChild(div);
		var cdiv = document.createElement('DIV');
			cdiv.id = 'history_changes_'+o.id;
	p.appendChild(cdiv);
		
		
	}
	
}

function showSettings(a) {
	var r = ''
	+ '<div id="menu_'+a+'" style="background-color:#667766;opacity:0.7;border: 1px orange dashed;margin:3px;padding:5px;">'
		+ '<BR>'
			+ '<span style="white-space: nowrap;" >'
				+ '<i style="color:#ffffaa" >check interval: </i>'
				+ '<input value="'+v.wa[a].interval+'" style="width:20px;" onchange="v.wa[\''+a+'\'].interval=parseInt(this.value);saveWorkingValues();">'
			+ '</span>'
		+ '<BR>'
			+ '<span style="white-space: nowrap;" >'
				+ '<i style="color:#ffffaa" >icon: </i>'
				+ '<input value="'+v.wa[a].attr.icon+'" style="width:70px;" onchange="v.wa[\''+a+'\'].attr.icon=this.value;saveWorkingValues();">'
			+ '</span>'
		+ '<BR>'
			+ '<span style="white-space: nowrap;" >'
				+ '<i style="color:#ffffaa" >threshold: </i>'
				+ '<input value="'+v.wa[a].app.etalon+'" style="width:70px;" onchange="v.wa[\''+a+'\'].app.etalon=this.value;saveWorkingValues();">'
			+ '</span>'
		+ '<BR>'
			+ '<span style="white-space: nowrap;" >'
				+ '<input value="save" style="width:50%;" onclick="toggle(this.parentElement.parentElement);saveWorkingValues();" type="button">'
				+ '<input value="cancel" style="width:50%;" onclick="toggle(this.parentElement.parentElement);" type="button">'
			+ '</span>'
	+ '</div>'
	;
	newSheet("Menu",r);
}

function toggleOnlineState(a) {
	loadJSON(
		  v.wa[a].url
		, function(a,b) {
			var r = ''
				+ '<div style="white-space: pre;color:#aafafa;background-color:#234567;width:600px;height:400px;z-index:100;overflow-y: auto;">'
					+ a
				+ '</div>'
			;
			newSheet("Orig",r);
		  }
		, function(a,b,err) {app.stop = true;console.log(null,app,a.responseURL,b,err,a);}
		, null
	);

}

function toggleHistory(a) {
	var ap = JSON.stringify(
		{
		  "max": v.sett.histSets[a].steps
		, "History:": v.hist[a]
		}
		,null,2)
	;
	
	var h = JSON.parse(localStorage.getItem('v.histChanges["'+a+'"]'));
	var r = '';
	for (var i = 0; i<h.length;i++) {
		r += '<li><u style="font-size:10px;">'+ humanDate(h[i].ts) + '</u>: <i style="color:brown;">' + h[i].s + '</i>';
	}
	r = ''
		+ '<div style="white-space: pre;color:#aafafa;background-color:#234567;width:300px;height:100px;z-index:100;overflow-y: auto;border: 3px orange double;" class="selectable">'
		+ '<ul >'
			+r
		+ '</ul>'
		+ '</div>'
		+ '<BR>'
		+ '<div style="white-space: pre;color:#bbbbff;background-color:#444567;width:300px;height:300px;z-index:100;overflow-y: auto;border: 2px orange dotted;" class="selectable">'
		+ ap
		+ '</div>'
	;
	newSheet('historyOfChangesDisplayed',r);
}

function saveWorkingValues() {
	var k = Object.keys(v.wa);
	var so = {};
	for (var i=0;i<k.length;i++) {
		var o = v.wa[k[i]];
		if (typeof(o) == 'object' && o.id) {
			so[k[i]] = {};
			so[k[i]].app = {};
			so[k[i]].interval = o.interval;
			so[k[i]].app.etalon = o.app.etalon;
			so[k[i]].app.where = o.app.where;
		}
	}
	
 	localStorage.setItem('v.wa.currents',JSON.stringify(so));
}

function toggle(obj) {
	if (!obj.id) {
		var el = obj;
		} else {
		var el = document.getElementById(obj);
	}
	el.style.display = (el.style.display != 'none' ? 'none' : '' );

}

function freshStats(o) {
	var id = o.id;
	var app = o.app;
	app.o = o;
	v.wa[id].s = 0;
	clearTimeout(v.wa[id].toMinute);
	clearTimeout(v.wa[id].alert);
	seconds(id);
	loadJSON(
		  v.wa[id].url
		, function(a,b) {
			//console.log('trying ' + v.wa[id].url);
			if (IsJsonString(a).obj.err) {
				v.runTime.errors.push({"ts":humanDate(new Date(),'YYYY.MM.DD HH24:MI:SS'),"module":decodeURIComponent(v.wa[id].url),"code":IsJsonString(a).obj.err});
				console.log("stopped on error!",humanDate(new Date(),'YYYY.MM.DD HH24:MI:SS'),decodeURIComponent(v.wa[id].url),IsJsonString(a).obj.err);
				app.stop = true;
				addToHist(id,{"s":IsJsonString(a).obj.err.errno});
				return false;
			}
			var d = eval('JSON.parse(a)'+app.path);
			var o = document.getElementById("state_"+id);
			
			if (app.prepare) {
				if (typeof(v.wa[id].app.etalon) != 'undefined') {
					app.etalon = String(v.wa[id].app.etalon);
					if ( typeof(app.etalon) == 'number' ) {
						app.etalon = parseInt(v.wa[id].app.etalon);
					}
					if ( typeof(app.etalon) == 'float' ) {
						app.etalon = parseFloat(v.wa[id].app.etalon);
					}
				}
				if (app.compare) {
					app.compare(d);
					} else {
					app.prepare(d);
				}
				addToHist(id,{"s":app.val});
				
				if ( app.alertLevel > 0 ) {
					showAlert.start(id);
					} else {
					showAlert.stop(id);
				}
			}

			if(!app.stop) {
				v.wa[id].refresh = setTimeout(
					function() {freshStats(app.o);
					}
					, v.wa[id].interval*1000
				);
				} else {
				console.log('STOPPED LOOPING ON ERROR!');
					/*
				function() {
						freshStats(app.o);
					}
					, v.wa[id].interval*1000*30
				);
				*/
			}

		  }
		, function(a,b,err) {app.stop = true;console.log(null,app,a.responseURL,b,err,a);}
		, app
	);

	
}

var showAlert = {
	start: function(o) {
		document.getElementById(o).style.color='red';
		
		v.wa[o].alert = setTimeout(
			function() {
				document.getElementById(o).style.borderColor='#f00';
				document.getElementById(o).style.backgroundColor = v.sett.alertBackground;
				setTimeout(
					function() {
						document.getElementById(o).style.borderColor='#f80';
						document.getElementById(o).style.backgroundColor = '#a33';
					}
					, 750
				);
				
				showAlert.start(o);
			}
			, 500
		);
	}
	, stop: function(o) {
		clearTimeout(v.wa[o].alert);
		document.getElementById(o).style.color='green';
		document.getElementById(o).style.backgroundColor = v.sett.calmBackgoundColor;
	}
	
}

function IsJsonString(str) {
	var m = new Object({"exc" : "not json","string":str,"obj":{}});
    try {
        var r = JSON.parse(str);
    } catch (e) {//console.log(e);
        return m;
    }
    return new Object({"obj":r,"string":JSON.stringify(str,null,2)});
}

function turnDetails(id) {
	//console.log(id);
	document.getElementById(id+"_t").style.display='none';
	document.getElementById(id+"_i").style.display='none';
	document.getElementById(id+"_m").style.display='';
	
	var o = document.getElementById(id);
}

function drawGridTable() {
	var table = document.createElement('TABLE'); 
	for (var y=0; y<v.sett.gridY; y++) {
		var tr = document.createElement('TR'); 
		for (var x=0; x<v.sett.gridX; x++) {
			var td = document.createElement('TD'); 
			td.id="grid_cell_"+(y+1)+"x"+(x+1)+"";
			td.style.width = v.sett.gridWidth;
			td.style.height = v.sett.gridHeight;
			var div = document.createElement('DIV'); 
			/*
			td.onmousedown = function () {
				v.wa.previousSquare = this.id;
				v.wa.currObjId = document.getElementById(this.id).children[0].id;
				v.wa.mouseUp = false;
			};
			td.onmouseup = function () {
				if (v.wa.mouseUp == true || v.wa.previousSquare==this.id ) {
					return false;
				}
				var id = document.getElementById(v.wa.previousSquare).children[0].id;
				var o = v.wa[id];
				o.app.where = this.id;
				//clearTimeout(v.wa[id].refresh);
				document.getElementById(v.wa.previousSquare).innerHTML='';
				initStats(o);
				v.wa.mouseUp = true;
			};
			*/
			td.ondrop= function() {
				drop(event);
			}
			td.ondragover= function() {
				allowDrop(event);
			}
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	table.onclick=function () {
		v.wa.inGrid=true;
	}
	table.onmouseout=function () {
		v.wa.inGrid=false;
	}
	document.getElementById("theGrid").appendChild(table);
}

function useGridCell(where,what) {
	
	var text = document.createTextNode(what); 
	var p = document.createElement('P'); 
	p.id = what+"_t";
	p.style.position='absolute';
	p.appendChild(text);
	var d = document.createElement("DIV"); 
	d.id = what;
	d.style.backgroundColor = v.sett.calmBackgoundColor;
	d.style.verticalAlign = 'middle';
	d.style.textAlign = 'center';
	d.style.paddingTop = '0px';
	d.style.width = ''+v.sett.gridWidth+'px';
	d.style.height = ''+v.sett.gridHeight+'px';
	d.style.fontSize= '10px';
	d.style.border= '3px '+v.sett.calmBackgoundColor+' solid';
	d.style.borderRadius='3px';
	d.appendChild(p);
	d.draggable = true;
	d.ondragstart = function () {
		drag(event);
	}
	
	d.onmouseover=function() {
		if (v.wa.keCode != 18) {
			turnDetails(this.id);
			} else {
			console.log(v.wa.keCode);
		}
	};
	d.onmousedown=function() {
		this.style.zIndex = -1;
		//console.log('')
	};
	d.onmouseout=function() {
		document.getElementById(what+"_t").style.display='';
		document.getElementById(what+"_i").style.display='';
		document.getElementById(what+"_m").style.display='none';
		document.getElementById(what+"_h").style.display='none';
	};
	//SUNFLOUR
	var i = document.createElement("IMG"); 
	i.src="../i/spin.png";
	i.id=what+"_i";
	i.style.width = v.sett.gridHeight;
	i.style.position = 'indent';
	i.style.opacity = 0.3;
	i.draggable = true;
	//MENU DIV
	var m = document.createElement("DIV"); 
	m.id=what+"_m";
	m.style.display='none';
	m.innerHTML = ''
		+ '<div style="width:98%;height:17px;border-bottom:3px orange double;white-space:nowrap;">'
			+ '<span style="width:20%;float:left;" id="'+what+"_tb"+'">129K</span>'
			+ '<span style="float:right;" id="'+what+"_ib"+'"></span>'
		+ '</div>'
		+ '<div style="width:100%;height:56%;text-align:left;">'
			+ '<span style="text-align:left;font-size:9px;" id="'+what+'_lts">timestamp (last)</span>'
		+ '</div>'
		+ '<div style="width:98%;height:20%;float:right;" id="'+what+'_sett">'
		+ '</div>'
	;
	//MESSAGE DIV
	var ms = document.createElement("DIV"); 
	ms.id=what+"_ms";
	ms.style.display='none';
	ms.style.position='absolute';
	//HISTORY DIV
	var t = document.createElement("DIV"); 
	t.id=what+"_h";
	t.style.display='none';
	t.innerHTML = ''
		+ '<div style="overflow-y: auto;">'
			+ 'history'
		+ '</div>'
	;
	
	d.appendChild(ms);
	d.appendChild(i);
	d.appendChild(m);
	d.appendChild(t);
	document.getElementById(where).innerHTML='';
	document.getElementById(where).appendChild(d);
}

function addToHist(a,o) {
	document.getElementById(a+"_lts").innerHTML = 'preparing for history';
	//console.log(a,o);
	/*
		Local history should not be too big and be kept in operative variable, so we allow to define the number of steps behind
	*/
	if (!a) {
		console.log(v.wa[v.wa.currObjId]);
	}
	if (!v.hist[a] )	{
		console.log(false,a);
		return false;
	}
	
	var d = new Date(); 
	o.ts = d.getTime();
	
	if (v.hist[a].length >= v.sett.histSets[a].steps) {
		v.hist[a].shift(o);
	}
	v.hist[a].push(o);
	
	//now we want to collapse similar messages, saving the timestamp of message changes only
	if (!v.histChanges[a] || !v.histChanges[a][0] || o.s != v.histChanges[a][(v.histChanges[a].length -1 )].s) {
		if (v.histChanges[a].length >= v.sett.histSets[a].histChangesSteps) {
			v.histChanges[a].shift(o);
		}
		v.histChanges[a].push(o);
		localStorage.setItem('v.histChanges["'+a+'"]',JSON.stringify(v.histChanges[a]));
	}
	
	if ( v.hist[a][(v.hist[a].length -2 )] && o.s != v.hist[a][(v.hist[a].length -2 )].s ) {
		var message = o.s;
		} else {
		var now = new Date();
		var interval = now.getTime() - v.histChanges[a][(v.histChanges[a].length -1 )].ts;
		var _d = new Date(interval);
		interval = addZero({i:_d.getUTCHours(),t:'h'}) + addZero({i:_d.getMinutes(),t:'m'}) + addZero({i:_d.getSeconds(),t:'s'})
		var message = '<i style="background-color:yellow;color:brown;">'+interval+'</i>'; 
	}
	
	document.getElementById(a+"_lts").innerHTML = ''
		+ 'last: ' + humanDate(o.ts)
		+ '<BR>'
		+ 'change: ' + humanDate(v.histChanges[a][(v.histChanges[a].length -1 )].ts)
		+ '<BR>'
		+ 'value: ' + v.histChanges[a][(v.histChanges[a].length -1 )].s
	;
	document.getElementById(a+"_ms").style.display = '';
	document.getElementById(a+"_ms").innerHTML = message;
	var was = document.getElementById(a+"_ms").style.color;
	document.getElementById(a+"_ms").style.color = 'cyan';
	setTimeout(
		function() {
			document.getElementById(a+"_ms").style.color = 'orange';
		}
		,v.sett.hideInfoInterval/2
	);
	setTimeout(
		function() {
			document.getElementById(a+"_ms").style.color = 'cyan';
		}
		,v.sett.hideInfoInterval
	);
	setTimeout(
		function() {
			document.getElementById(a+"_ms").style.display='none';
		}
		,v.sett.hideInfoInterval+1000
	);
	document.getElementById(a).style.borderColor = v.sett.updatedBorder;
	setTimeout(
		function() {
			document.getElementById(a).style.borderColor = ''+v.sett.calmBackgoundColor+'';
		}
		, v.sett.hideInfoInterval
	);



}

function addZero(o) {
	/*
		BTW did I already mentioned I love js formatting?.. extra function for leading zeroes - what a joy
	*/
	var i = o.i;
	var opt = o.opt;
	var t = o.t;
	
	if (i == 0 && t=='h') {
		return '';
	}
	if (i > 0 && t=='h') {
		if (o.opt) { 
			return i+'<b id="_c'+opt+'" style="color:grey;">:</b>';
			} else {
			return i+':';
		}
	}
    if (i < 10) {
        i = "0" + i;
    }
    if (t=='s') {
		if (o.opt) { 
			var _c = '<b id="_c'+opt+'" style="color:grey;">:</b>';
			} else {
			var _c = ':';
		}
    	var _c = '<b id="_c'+opt+'" style="color:grey;">:</b>';
    	} else {
    	var _c = '';
    }
    return _c+i;
}

function humanDate(d,format) {
	var date = new Date(d);
	var a = [
	   date.getFullYear(),
	   date.getMonth()+1,
	   date.getDate(),
	   date.getHours(),
	   date.getMinutes(),
	   date.getSeconds(),
	];
	var _r = date;
	if (typeof(format) == 'undefined') {
		var _r = '<i title="' + a[0] + '.' + a[1] + '.' + a[2] +'">' +addZero({i:a[3],t:'h'}) + addZero({i:a[4],t:'m'}) + addZero({i:a[5],t:'s'})+ '</i>';
		//+ addZero(_d.getUTCHours(),null,'h') + addZero(_d.getMinutes(),null,'m') + addZero(_d.getSeconds(),null,'s');
	}
	if (format == 'YYYY.MM.DD HH24:MI:SS') {
		var _r = a[0] + '.' + a[1] + '.' + a[2] 
			+ ' '
			+ String(a[3]+100).slice(-2) + ':' + String(a[4]+100).slice(-2) + ':' + String(a[5]+100).slice(-2)
		;
	}
	return _r;
}

function getLocation(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    }
}

function newSheet(id,t){
	var old = document.getElementById(id);
	if (old) {
		document.body.removeChild(old);
	}
	var e = v.wa.e;
	var x = e.pageX + 20 + 'px';
	var y = e.pageY + 20 + 'px';
	var div = document.createElement('DIV');
	div.id=id;
	div.style.position = 'absolute';
	div.style.left = x;
	div.style.top = y;
	div.style.display='';
	div.className = 'selectable';
	//div.appendChild(img);
	div.innerHTML = '' + t;
	div.onmouseover = function () {
		v.wa.inGrid = true;
	}
	div.onmouseout = function () {
		v.wa.inGrid = false;
	}
	document.body.appendChild(div);        
};

function mousePosition (e) {
	v.wa.e = e;
};

function allowDrop(ev) {
	if (ev.target.id && ev.target.id != v.wa.taken && ev.target.id.substr(0,9) != 'grid_cell') {
		//showNotDroppable(ev);
		document.getElementById(ev.target.id).droppable = false;
	}
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    v.wa.taken = ev.target.id;
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (ev.target.id && ev.target.id.substr(0,9) == 'grid_cell') {
		ev.target.appendChild(document.getElementById(data));
		v.wa[v.wa.taken].app.where = ev.target.id;
		saveWorkingValues();
		} else {
		showNotDroppable(ev);
    }
}

function showNotDroppable(ev) {
	var o = document.getElementById(ev.target.id);
	if (o) {
		document.getElementById(ev.target.id).style.backgroundColor = 'red';
		document.getElementById(ev.target.id).droppable = false;
		setTimeout(
			function () {
				document.getElementById(ev.target.id).style.backgroundColor = '';
			}
		, 1500
		);
	}
}

function checkKey(e) {
	var event = window.event ? window.event : e;
	v.wa.keCode = event.keyCode;
	//console.log(v.wa.keCode);
	if (v.wa.almost == 'almost' && event.keyCode==68) {	//Ctrl+D
		if (v.wa.debug != 'on'){
			v.wa.debug = 'on';
			} else {
			v.wa.debug = 'off';
		}
		} else {
		if (event.keyCode == 17 ) {
			v.wa.almost = 'almost';
		}
	}
	localStorage.setItem('debug',v.wa.debug);
}

function keyUp(e) {
	var event = window.event ? window.event : e;
	v.wa.keCode = 0;
}

function print(o) {
	if (localStorage.getItem('debug') == 'on') {
		console.log(o);
	}
}






drawGridTable();
var e = 0;
v.runTime.initiated = humanDate(new Date(),'YYYY.MM.DD HH24:MI:SS');
document.getElementById("runTime").onmouseover = mousePosition;
document.getElementById("runTime").onclick = function () {
	v.wa.inGrid = false;
	newSheet("mainRun",JSON.stringify(v.runTime,null,2));
	document.getElementById("mainRun").style.color = 'white';
	document.getElementById("mainRun").style.whiteSpace = 'pre';
	v.wa.inGrid = true;
};



document.onkeydown = checkKey;
document.onkeyup = keyUp;



document.onkeyup = function(e) {
	v.wa.key = e.keyCode;
	for (var i=0;i<v.wa.clearOnWscape.length;i++) {
		var old = document.getElementById(v.wa.clearOnWscape[i]);
		if (old) {
			document.body.removeChild(old);
		}
	}
}

document.body.onclick = function () {
	if (!v.wa.inGrid) {
		for (var i=0;i<v.wa.clearOnWscape.length;i++) {
			var old = document.getElementById(v.wa.clearOnWscape[i]);
			if (old) {
				document.body.removeChild(old);
			}
		}
	}
}

v.wa.debug = localStorage.getItem('debug') || 'off';

/*
	http://www.quirksmode.org/js/events_order.html
	http://www.w3schools.com/html/html5_draganddrop.asp not working
*/