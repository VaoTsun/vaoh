var v = {
	dataProp: {
		jsonLoadingTime: 0
	}
	, "wa": {
		"form":{}
		, "consumers": []
		, "UtfFound": false
	}
	, "scenarios" : {}
}

function loadJSON(path, success, error, app) {
	var startTime = new Date().getTime();
	var xhr = new XMLHttpRequest();
	var data;
	if (!app.mime) {
		app.mime="json";
	}
	
	xhr.onreadystatechange = function() {
		v.dataProp.jsonLoadingTime = ( new Date().getTime() - startTime );
		//app = null;
		if (xhr.readyState === XMLHttpRequest.DONE) {
			if (xhr.status === 200) {
				//console.log(app.mime);
				if (success) {
					success(xhr.responseText, app);
				}
			} else {
				if (error)
					error(xhr);
			}
		}
	};
	xhr.open("GET", path, true);
	xhr.send();
}

function drpDown(_o,_z) {
	if (!_o) {
		return false;
	}
	//console.log(_z.holder);
	//console.log(_o);
	var d = IsJsonString(_o).obj;
	if (!d.rows) {
		console.log('no data for dropdown '+_z.holder);
		return false;
	}
	var z = document.getElementById(_z.holder);
	//var k = Object.keys(d.rows[0]);
	
	var h = document.createElement("select");
	h.style.maxWidth = '20px;';
	//console.log(_z);
	z.appendChild(h); 


	if (_z.onch) {
		h.onchange = _z.onch;
	}
		
	if (_z.nullVal) {
		var no = {};
		no[_z.id] = null;
		no[_z.value] = _z.nullVal;
		d.rows.push(no);
	}

	for (var i=0;i<d.rows.length;i++) {
		var p = document.createElement("option");
		p.value = d.rows[i][_z.id];
		p.text = d.rows[i][_z.value];
		if (z.selected && z.selected == d.rows[i][_z.id]) {
			p.selected = true;
		}
		h.appendChild(p); 
	}
	//console.log(d.fields);
	
}

function IsJsonString(str) {
	var m = new Object({"exc" : "not json","string":str,"obj":{}});
    try {
        var r = JSON.parse(str);
    } catch (e) {
    	console.log(m);
        return m;
    }
    return new Object({"obj":r,"string":JSON.stringify(str,null,2)});
}

function toggle(obj) {
	if (obj.id) {
		var el = obj;
		} else {
		var el = document.getElementById(obj);
	}
	el.style.display = (el.style.display != 'none' ? 'none' : '' );

}

function dataComplicated(data) {
	if (!data.rows) {
		console.log('NO_DATA');
		return data;
	}
	var k = Object.keys(data.rows[0]);
	for (var i=0;i<k.length;i++) {
		if (k[i].slice(-4) == ':utf') {
			v.wa.UtfFound = true;
		}
	
	}
	if (v.wa.UtfFound == true) {
		for (var i=0;i<data.rows.length;i++) {
			for (var e=0;e<k.length;e++) {
				if (k[e].slice(-4) == ':utf' && data.rows[i][k[e]] != null ) {
					data.rows[i][k[e]] = data.rows[i][k[e]].hexDecode();
				}
			}
		}
	}
	return data;
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

