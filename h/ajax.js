var v = {
	dataProp: {
		jsonLoadingTime: 0
	}
	, "wa": {}
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
	var d = JSON.parse(_o);
	var z = document.getElementById(_z.holder);
	//var k = Object.keys(d.rows[0]);
	
	var h = document.createElement("select");
	//th.innerHTML='+';
	h.style.maxWidth = '20px;';
	z.appendChild(h); 
	
	h.onchange = function() {
		this.style.color = 'blue';
	}
		
	for (var i=0;i<d.rowCount;i++) {
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

