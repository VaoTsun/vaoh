var v = {
	dataProp: {
		jsonLoadingTime: 0
	}
	, "wa": {
		"form":{}
		, "consumers": []
	}
	, "scenarios" : {}
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
				if (success) {
					xhr.responseText = IsJsonString(xhr.responseText);
					//console.log(xhr.responseText);
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
	var d = JSON.parse(_o);
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
    } catch (e) {//console.log(e);
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

