var globalStartTime = new Date().getTime();
var data;
var v = {
	  "loaded" : false
	, "loadingStep" : 50
	, "loadingTime" : 0
	, "calcBuff" : {}
	, "outlook" : {
		  "calculationTabPosition":"middle"
		, "calculationTabPositions": {"top":"top","middle":"middle","bottom":"bottom"}
		, "highlightPosition" : true
		, "monochromeZebra" : true
		, "skipPreAgg" : false
		, "thousandSeparator" : ","
		, "tooManyRows" : 2000
	}
	, "dataProp" : {
		  "numeric" : function () { return {"columnName":null, "dataType": null,"sum":0,"cnt":0, "min":null,"max":null,"avg":null,"order":null}; }
		, "float" : function () { return {"columnName":null, "dataType": null,"sum":0,"cnt":0, "min":null,"max":null,"avg":null,"order":null}; }
		, "string" : function () { return {"columnName":null, "dataType": null,"cnt":0,"maxLength" : null, "minLength" : null,"order":null}; }
		, "date" : function () { return {"columnName":null, "dataType": null,"cnt":0,"maxDate" : null, "minDate" : null,"order":null}; }
		, "columns" : {}
		, "caseSensitiveSort" : true
		, "app" : {}
	}
	, "styles": {
		  "defaultColor":"#449977"
		, "countTd" : {
			  "opacity": 0.7
			, "borderStyle": "solid"
			, "borderWidth": "1px"
			, "borderColor": "#FF0000"
			, "backgroundColor": "#feeeff"
			, "color": "brown"
			, "width": "20px"
		}
		, "calculationsTd" : {
			  "opacity": 0.9
			, "borderStyle": "solid"
			, "borderWidth": "1px"
			, "borderColor": "#FF0000"
			, "backgroundColor": "black"
			, "color": "#55ff55"
			, "width": "20px"
			, "whiteSpace": "nowrap"
			, "font-size":"14px"
			, "text-align": "right"
			, "border-left": "1px solid grey"
		}
		, "headerTr" : {
			  "opacity": 0.8
		}
		, "dataTable" : {
			  "borderStyle": "solid"
			, "borderWidth": "1px"
			, "borderColor": "#ffffff"
			, "backgroundColor": "#ffffff"
			, "color": "black"
		}
		, "highLight" : {
			  "backgroundColor": "purple"
			, "color": "red"
			, "fontWeight": "bold"
			, "borderBottom" : "3px double green"
		
		}
		, "PositiveFloat" : {
			  "color": "#22aa33"
			, "fontWeight": "normal"
		}
		, "NegativeFloat" : {
			  "color": "#cc2222"
			, "fontWeight": "normal"
		}
		, "PositiveNumeric" : {
			  "color": "#118822"
			, "fontWeight": "normal"
		}
		, "NegativeNumeric" : {
			  "color": "#bb1111"
			, "fontWeight": "normal"
		}
		
		

	}
	, "prevStyles" : {}
}
v.dataProp.query='last9';
v.dataProp.url = window.location.origin + '/db?q='+v.dataProp.query;
v.dataProp.url = window.location.origin + '/h/long.json';
var sav = IsJsonString(localStorage.getItem('v.dataProp.columns'));
if (sav == null || Object.keys(sav).length < 1) {
	sav=v.dataProp.columns;
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

function applyStyles(_o,_s) {
	var _k = Object.keys(_s);
	for (var _i=0;_i<_k.length;_i++) {
		_o.style[_k[_i]]=_s[_k[_i]];
	}
}

function loadJSON(path, success, error, app) {
	var startTime = new Date().getTime();
	var xhr = new XMLHttpRequest();
	var data;

	xhr.onreadystatechange = function() {
		v.dataProp.jsonLoadingTime = ( new Date().getTime() - startTime );
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

function createCalculationsRow() {
	var rk = Object.keys(data[0]);
	var tr = document.createElement("TR"); 
		tr.id = "calculations";
		var text = document.createTextNode(data.length); 
		var td = document.createElement("TD"); 
		td.id = "calc_td"
		td.appendChild(text);
		applyStyles(td,v.styles.calculationsTd);
		td.style.fontSize = "13px";
		td.style.backgroundColor = "orange";
		td.style.color = "black";
		tr.appendChild(td); 
		td.ondblclick = function () {
			v.calcBuff.wheel_1 = this.innerHTML;
			this.innerHTML = calculationTabPosition();
			document.getElementById('calculationTabPosition').onchange = function () {
				v.outlook.calculationTabPosition = this.value;
				localStorage.setItem('v.outlook',JSON.stringify(v.outlook));
				createTable();
			}
			/*
			document.getElementById('calculationTabPosition').onmouseover = function () {
				v.calcBuff.calcB = 
				document.getElementById('calc_td').style = v.calcBuff.wheel_1;
			}
			*/
			document.getElementById('calculationTabPosition').onmouseout = function () {
				document.getElementById('calc_td').innerHTML = v.calcBuff.wheel_1;
			}
			/*
			*/
		}

	for (var e=0;e<rk.length;e++) {
		
		v.calcBuff[rk[e]] = [];
		
		var text = document.createTextNode(" "); 
		var td = document.createElement("TD"); 
		td.appendChild(text);
		td.id = 'calc'+e;
		applyStyles(td,v.styles.calculationsTd);
		td.ondblclick = function () {
			var j = JSON.parse(this.title);
			this.innerHTML = jsonToDropDown(j,this.innerHTML);
			document.getElementById('changeDefaultMethod').onchange = function () {
				v.dataProp.columns[j.columnName].defaultMethod=this.value;
				console.log('calc'+(j.columnNr-1),j);
				document.getElementById('calc'+(j.columnNr-1)).innerHTML = this.value + ': ' + j[this.value];
				localStorage.setItem('v.dataProp.columns',JSON.stringify(v.dataProp.columns));
			}
			document.getElementById('changeDefaultMethod').onmouseout = function () {
				document.getElementById('calc'+(j.columnNr-1)).innerHTML = this.value + ': ' + j[this.value];
			}
		}
		td.onclick = function () {
			var j = JSON.parse(this.title);
			//document.createElement("div"); 
			//this.innerHTML = jsonToList(j);
		}
		tr.appendChild(td); 
	}
	return tr;
}

function mergeSaved(k) {	//mergeSaved('outlook')
	var a = k,k = v[k];
	var kk = Object.keys(k);
	var saved = JSON.parse(localStorage.getItem('v.'+a));
	for (var i=0; i<kk.length; i++) {
		if (typeof(saved[kk[i]]) != 'undefined' ) {
			k[kk[i]] = saved[kk[i]];
		}
	}
}

function $(o) {
	return document.getElementById(o);
}

function fillupTable() {
	var startTime = new Date().getTime();
	var k = Object.keys(data);
	var rk = Object.keys(data[0]);
	mergeSaved('outlook');
	defineDataTypes();
	var table = $("t_"+v.dataProp.query);
	applyStyles($('header'),v.styles.headerTr);
	//header style & sorting buttons from http://stackoverflow.com/questions/2701192/character-for-up-down-triangle-arrow-to-display-in-html
	for (var e=0;e<rk.length;e++) {
		$('hdr'+(e)).innerHTML =  rk[e]
			+ '&nbsp;'
			+ '<sup style="font-size:10px;color:pink;" onclick="sortResults(\'hdr'+e+'\',\'asc\');" >&#9650;</sup>'
			+ '<sub style="font-size:10px;color:pink;" onclick="sortResults(\'hdr'+e+'\',\'desc\');" >&#9660;</sub>'
		applyStyles($('hdr'+e),v.styles.headerTr);
	}

	//Data itself
	for (var i=0;i<k.length;i++) {
		for (var e=0;e<rk.length;e++) {
			var val = data[k[i]][rk[e]];
			if ( !v.outlook.skipPreAgg) {
				if (v.dataProp.columns[rk[e]].dataType == 'numeric' || v.dataProp.columns[rk[e]].dataType == 'float') {
					v.calcBuff[rk[e]].push(parseFloat(val));
					v.dataProp.columns[rk[e]].sum += parseFloat(val);
					v.dataProp.columns[rk[e]].cnt += 1;
				}
			
				if (v.dataProp.columns[rk[e]].dataType == 'date') {
				
					var cd = new Date(val);
					if (v.dataProp.columns[rk[e]].minDate == null || v.dataProp.columns[rk[e]].minDate > cd) {
						v.dataProp.columns[rk[e]].minDate = cd;
					}
					if (v.dataProp.columns[rk[e]].maxDate == null || v.dataProp.columns[rk[e]].maxDate < cd) {
						v.dataProp.columns[rk[e]].maxDate = cd;
					}
					val = DateFormat(new Date(val),'YYYY-MM-DD HH24:MI');
				}
			
				if (v.dataProp.columns[rk[e]].dataType == 'string') {
				
					if (v.dataProp.columns[rk[e]].maxLength == null || val.length > parseInt(v.dataProp.columns[rk[e]].maxLength)) {
						v.dataProp.columns[rk[e]].maxLength = val.length;
					}
					if (v.dataProp.columns[rk[e]].minLength == null || val.length <= parseInt(v.dataProp.columns[rk[e]].minLength)) {
						v.dataProp.columns[rk[e]].minLength = val.length; 
					}
					if (v.calcBuff[rk[e]].indexOf(val) < 0) {
						v.calcBuff[rk[e]].push((val));
					}
					v.dataProp.columns[rk[e]].cnt += 1;
				}
			
				} else {
				val = 	data[k[i]][rk[e]];
			}
			var td = $('_'+i+'_'+e); 
			td.title = 'original value: ' + data[k[i]][rk[e]]; 

			td.innerHTML = val;
			if (v.outlook.monochromeZebra) {
				if (parseInt(i/2) == parseFloat(i/2)) {
					td.className="light";
					} else {
					td.className="hard";
				}
			}
			if (v.outlook.highlightPosition) {
				td.onmouseover = function () {
					var c = document.getElementById('hdr'+this.id.split('td')[1]);
					v.prevStyles[c.id] = c.style.cssText;
					v.prevStyles[this.id] = this.style.cssText;
					for (var i=0;i<this.parentElement.children.length;i++) {
						var id = this.parentElement.children[i];
						v.prevStyles[id.id] = id.style.cssText;

						id.style.borderBottom = 'thin double red';
						applyStyles(id,v.styles.highLight);
					}
					applyStyles(c,v.styles.highLight);
					this.style.color = "white";
				}
				td.onmouseout = function () {
					var c = document.getElementById('hdr'+this.id.split('td')[1]);
					c.style.cssText = v.prevStyles[c.id];
					for (var i=0;i<this.parentElement.children.length;i++) {
						var id = this.parentElement.children[i];
						id.style.cssText =  v.prevStyles[id.id];
					}
				}
			}
		}
	}
	
	if ( v.outlook.calculationTabPosition == "middle" ) {
		if ($('calculations')) {
    		$('calculations').parentNode.removeChild($('calculations'));
		}
		table.insertBefore(createCalculationsRow(),$('header').parentElement.children[1]);
	}
	fillInCalculationsRow();

	
	var endTime = new Date().getTime();
	v.dataProp.app.timeHtmlProcess = ( new Date().getTime() - startTime );
	document.getElementById('calc_td').title = JSON.stringify(v.dataProp.app,null,2);

	console.log(v.dataProp.columns);
	//localStorage.setItem('v.dataProp.columns',JSON.stringify(v.dataProp.columns,null,2))

	return true;	
}

function createHtmlTable() {
	var startTime = new Date().getTime();
	var k = Object.keys(data);
	var rk = Object.keys(data[0]);
	var table = document.createElement("TABLE"); 
	table.id = "t_"+v.dataProp.query;
	document.getElementById("o").innerHTML='';
	document.getElementById("o").appendChild(table);
	table.onclick = function () {
		v.dataProp.clickTime = new Date().getTime();
	}
	var header = document.createElement("TR"); 
	header.id = "header";
	var th = document.createElement("TH");
	th.innerHTML='+';
	header.appendChild(th); 
	for (var e=0;e<rk.length;e++) {
		var th = document.createElement("TH");
		th.innerHTML=rk[e];
		th.id = 'hdr'+e;
		header.appendChild(th); 
	}
	table.appendChild(header); 
	
/*
	var calculationTr = document.createElement("TR"); 
	calculationTr.id='calculationTr';
	for (var e=0;e<(rk.length + 1);e++) {
		var td = document.createElement("TD");
		td.innerHTML='calcs';
		calculationTr.appendChild(td); 
	}
	table.appendChild(calculationTr); 
*/	
	for (var i=0;i<k.length;i++) {
		var tr = document.createElement("TR"); 
		tr.id="tr_"+i;
		var text = document.createTextNode(i+1); 
		var td = document.createElement("TD"); 
		td.appendChild(text);
		tr.appendChild(td); 
		for (var e=0;e<rk.length;e++) {
			var td = document.createElement("TD");
			td.id = '_'+i+'_'+e;
			tr.appendChild(td); 
		}
		table.appendChild(tr); 
	}
	v.dataProp.app.HtmlStructurePrepare = ( new Date().getTime() - startTime );
}


function fillInCalculationsRow() {
	var rk = Object.keys(data[0]);
	for (var e=0;e<rk.length;e++) {
		var c = v.dataProp.columns[rk[e]];
		if ( c.dataType == 'string' || c.dataType == 'date' ) {
			c.distinctValues = v.calcBuff[rk[e]].length;
		}
		if ( c.dataType == 'date' ) {
			var val = v.dataProp.columns[rk[e]].maxDate - v.dataProp.columns[rk[e]].minDate;
			v.dataProp.columns[rk[e]].interval = millisecondsToStr(val);
			v.dataProp.columns[rk[e]].minDate = DateFormat(v.dataProp.columns[rk[e]].minDate,'YYYY-MM-DD HH24:MI');
			v.dataProp.columns[rk[e]].maxDate = DateFormat(v.dataProp.columns[rk[e]].maxDate,'YYYY-MM-DD HH24:MI');
		}
		/*
		*/
		if ( c.dataType == 'numeric' || c.dataType == 'float' ) {
			c.min = Math.min.apply(null, v.calcBuff[rk[e]]);
			c.max = Math.max.apply(null, v.calcBuff[rk[e]]);
			c.avg = c.sum / c.cnt;
		}
		document.getElementById('calc'+e).title = JSON.stringify(c,null,2);
		if (v.dataProp.columns[rk[e]].defaultMethod) {
			document.getElementById('calc'+e).innerHTML = 
				v.dataProp.columns[rk[e]].defaultMethod 
				+ ': ' + numberWithCommas(
					v.dataProp.columns[rk[e]][v.dataProp.columns[rk[e]].defaultMethod]
				);
			} else {
			document.getElementById('calc'+e).innerHTML = 'dataType';
		}
		
	}
}

function millisecondsToStr (milliseconds) {
	//http://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
    // TIP: to find current time in milliseconds, use:
    // var  current_time_milliseconds = new Date().getTime();

    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    //TODO: Months! Maybe weeks? 
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second'; //'just now' //or other string you like;
}

function showWaiting(c) {
	if (v.loaded) {
		//v.dataProp.loadingTime = 'loaded in ' + v.loadingTime + ' ms.';
		return null;
	}
	v.loadingTime += v.loadingStep;
	document.getElementById("s").innerHTML='' + ((c*(1000/v.loadingStep))).toFixed(1);
	setTimeout(
		function() {
			showWaiting(c+1);}
			, v.loadingStep
	);
}

function onLoad() {
	console.log('loaded:' ,new Date().getTime() - globalStartTime);
}

function jsonToDropDown(j,v) {
	var k = Object.keys(j);
	var r = '<select id="changeDefaultMethod" >';
	var selected = v.split(':')[0];
	
	for (var i = 0; i < k.length ; i++) {
		if (selected == k[i]) {
			var s = 'SELECTED ';
			} else {
			var s = '';
		}
		r +='<option '+s+'>' + k[i];
	}
	r += '</select>';
	return r;
}

function jsonToList(j) {
	var k = Object.keys(j);
	var r = '<ul>';
	for (var i = 0; i < k.length ; i++) {
		r +='<li>' + k[i] + ':' + j[k[i]];
	}
	r += '</yl>';
	return r;
}

function calculationTabPosition() {
	var j = v.outlook.calculationTabPositions;
	var k = Object.keys(j);
	var r = '<select id="calculationTabPosition" >';
	
	for (var i = 0; i < k.length ; i++) {
		if (v.outlook.calculationTabPosition == k[i]) {
			var s = 'SELECTED ';
			} else {
			var s = '';
		}
		r +='<option '+s+'>' + k[i];
	}
	r += '</select>';
	return r;
}



function defineDataTypes() {
	/*
		Type of column could be checked against each value. Should it be?
		When null, we don't convert it to zeroes, so numeric won't be assigned as value datatype
	*/
	var rk = Object.keys(data[0]);
	
	for (var e=0;e<rk.length;e++) {
		var val = data[0][rk[e]];
		//initiateColumn(e,'string');

		var m = String(val).match( /^(\d{4})-(\d{1,2})-(\d{1,2})/ );
		if (m) {
			initiateColumn(e,'date'); /* should be more sophisticated to timestamp and time and etc*/
		}
		
		var n = String(val).match( /^[-]{0,1}(\d{1,99})$/ );
		if (n) {
			initiateColumn(e,'numeric');
			val = Number(val); 
			if (v.dataProp.columns[rk[e]].dataType != 'float') {	/* if has numeric mask and was not previously at least once declared as float - treat like a number, but not change type */
				v.dataProp.columns[rk[e]].dataType = 'numeric';
			}
		}

		var fw = String(val).match(/^[+-]?\d+(\.\d+)$/);
		if (fw) {
			initiateColumn(e,'float');
			val = Number(val);	//v = Number(c).toFixed(DecimalN); We might want to be able to use exact not rounded value in title...
		}
		
		if (!m && !n && !fw) {
			initiateColumn(e,'string');
		}
	}
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

function initiateColumn(e,t) {
	var rk = Object.keys(data[0]);
	if ( typeof(sav[rk[e]]) == 'undefined') {
		sav[rk[e]] = new v.dataProp[t];
	}
	v.dataProp.columns[rk[e]] = sav[rk[e]];
	//console.log(v.dataProp.columns[rk[e]]);
	//v.dataProp.columns = sav;
	//console.log(sav[rk[e]]);
	//mergeSaved('dataProp');
	//v.dataProp.columns[rk[e]] = v.dataProp[t];
	v.dataProp.columns[rk[e]].dataType = t;
	v.dataProp.columns[rk[e]].columnName = rk[e];
	v.dataProp.columns[rk[e]].columnNr = e+1;
	v.dataProp.columns[rk[e]].defaultMethod = sav[rk[e]].defaultMethod;
	v.dataProp.columns[rk[e]].order = sav[rk[e]].order;
	v.dataProp.columns[rk[e]].columnName = rk[e];
	//localStorage.setItem('v.dataProp.columns',JSON.stringify(v.dataProp.columns))
	//console.log(v.dataProp.columns,rk[e]);
}

function DateFormat(d,format) {
	if (format != 'YYYY-MM-DD' && format != 'YYYY-MM-DD HH24:MI') {
		format = 'YYYY-MM-DD';
	}
	var formats = new Array();
	var month = new Array();
	var d = new Date(d);
	month[0] = "January";
	month[1] = "February";
	month[2] = "March";
	month[3] = "April";
	month[4] = "May";
	month[5] = "June";
	month[6] = "July";
	month[7] = "August";
	month[8] = "September";
	month[9] = "October";
	month[10] = "November";
	month[11] = "December";

	month[0] = "01";
	month[1] = "02";
	month[2] = "03";
	month[3] = "04";
	month[4] = "05";
	month[5] = "06";
	month[6] = "07";
	month[7] = "08";
	month[8] = "09";
	month[9] = "10";
	month[10] = "11";
	month[11] = "12";

	var n = month[d.getMonth()];
	formats['YYYY-MM-DD HH24:MI']=d.getFullYear() + "-" + n + "-" + (d.getDate()+100).toString().slice(-2) + " " + (d.getHours()+100).toString().slice(-2) + ":" + (d.getMinutes()+100).toString().slice(-2);
	formats['YYYY-MM-DD']=d.getFullYear() + "-" + n + "-" + (d.getDate()+100).toString().slice(-2);
	return formats[format];
}

function shadeRGBColor(color, percent) {
	/*
		Taken from http://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
	*/
	if (typeof(color) == 'undefined') { 
		console.log('shadeRGBColor(color, percent) - undefiend color');
		return "rgb(230,30,30)";
	}
	var f=color.split(",");
	var R=parseInt(f[0].slice(4));
	var G=parseInt(f[1]);
	var B=parseInt(f[2]);
	if (R==G) {
		R = 20*cnt;
		G = 20*cnt;
		B = 0;
	}
	if (R==B) {
		R = 10*cnt;
		G = 0;
		B = 10*cnt;
	}
	if (G==B) {
		R = 0;
		G = 20*cnt;
		B = 20*cnt;
	}
	cnt++;
	return "rgb("+R+','+G+','+B+")";
}

function numberWithCommas(x) {
	if (typeof(x)=='undefined' || x==null) {
		return 'NULL';
	}
	if (String(v.outlook.thousandSeparator).length > 0) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "<b style=\"opacity:0.5;\">"+v.outlook.thousandSeparator+"</b>");
	}
	return x.toString();
}

	function highlightByClassifiedIds(k,v,i) {
		/* 
			if value can be id of classifier => we can separate rows visually
			should check only if order by is on current column
		*/
		if (typeof(v)=='undefined' || v==null) {
			return false;
		}
		if (Dcolumn == k) {
			if (typeof(seen_ids[v])=='undefined') {
				seen_ids[v]=i;
				seen_idsi[i]=v;
				colorGlobal[v]=$('#tr_'+i).css('background-color');
				colorGlobal[v]=shadeRGBColor(colorGlobal[v], -0.1)
			}
		}
	}
	
function sortResults(o,a) {
	/*
		added .toLowerCase() for case insensitive comparison as it seems expected
		maybe NULL sorting should be parametrized
		maybe sorting should be indexed & mapped like https://en.wikipedia.org/wiki/Schwartzian_transform
	*/
	var startTime = new Date().getTime();
	
	this.caseSensitive = function(s) { 
		if (v.dataProp.caseSensitiveSort) {
			return s.toLowerCase();
		}
		return s;
	}
	
	var ak = Object.keys(v.dataProp.columns);
	v.dataProp.columns[ak[o.split('hdr')[1]]].order = a;
	var c = v.dataProp.columns[ak[o.split('hdr')[1]]];
	
	data = data.sort(function(a, b) {
		if (c.order == 'asc') {
			if (c.dataType == 'numeric' || c.dataType == 'float') {
				return (a[c.columnName] - b[c.columnName]);
				} else {
				if ( this.caseSensitive(a[c.columnName]) > this.caseSensitive(b[c.columnName])) {
					return 1;
					} else {
					return -1;
				}
			}
			} else {
			if (c.dataType == 'numeric' || c.dataType == 'float') {
				return (b[c.columnName] - a[c.columnName]);
				} else {
				if ( this.caseSensitive(a[c.columnName]) < this.caseSensitive(b[c.columnName])) {
					return 1;
					} else {
					return -1;
				}
			}
		}
	});
/*
*/
	var endTime = new Date().getTime();
	v.dataProp.app.dataSortingTime = ( new Date().getTime() - startTime );
	//console.log(v.dataProp.dataSortingTime);
	
	fillupTable();
	return true;
	}
	

var prep = function () {
	console.log('initiated:' ,new Date().getTime() - globalStartTime);
	data = new Array();
	data[0] = new Array();
	data[1] = new Array();
	data[2] = new Array();
	data[0]["one"] = 'polk';
	data[1]["one"] = 'polk';
	data[2]["one"] = 'polk';
	createHtmlTable();
}



showWaiting(0);
prep();
loadJSON(
	  v.dataProp.url
	, function(a,b) {//console.log(b);
		v.dataProp.app.timeJsonSrc = ( new Date().getTime() - globalStartTime );
		
		data = JSON.parse(a).rows;
		
		createHtmlTable();
		bcl();
	  }
	, function(a,b,err) {console.log(a,b,err);}
	, 23
);

function bcl() {
	v.dataProp.app.timeJsonSrc = ( new Date().getTime() - globalStartTime );
	console.log(data.length);	//return true;
	var k = Object.keys(data[0]);
	var UtfFound = false;
	for (var i=0;i<k.length;i++) {
		if (k[i].slice(-4) == ':utf') {
			UtfFound = true;
		}
	
	}
	if (UtfFound == true) {
		var utfTime = new Date().getTime();
		for (var i=0;i<data.length;i++) {
			for (var e=0;e<k.length;e++) {
				if (k[e].slice(-4) == ':utf') {
					data[i][k[e]]=data[i][k[e]].hexDecode();
				}
			}
		}
		v.dataProp.app.timeUtfDecode = (new Date().getTime() - utfTime);
	}
	v.dataProp.app.timeJsonParse = ( new Date().getTime() - globalStartTime - v.dataProp.app.timeJsonSrc);
	if (data.length > v.outlook.tooManyRows) {
		document.getElementById("s").innerHTML = 'disabling candies - data is too big ('+data.length+')';
		v.outlook.monochromeZebra = false;
		v.outlook.highlightPosition = false;
		v.outlook.skipPreAgg = true;
		localStorage.setItem('v.outlook',JSON.stringify(v.outlook,null,2));
	}
	fillupTable();
	v.loaded = true;
	v.dataProp.app.total = ( new Date().getTime() - globalStartTime);
	console.log(v.dataProp.app);
}

window.onload = onLoad();



function IsJsonString(str) {
	var e = new Object({"exc" : "not json"});
    try {
        var r = JSON.parse(str);
    } catch (e) {console.log(e);
        return e;
    }
    return r;
}

