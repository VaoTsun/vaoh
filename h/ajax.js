var v = {
	dataProp: {
		jsonLoadingTime: 0
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
	
	/*
	th.onclick = function() {
		var el = document.getElementById('table_menu');
		el.style.display = (el.style.display != 'none' ? 'none' : '' );
		document.getElementById('v.dataProp.url').value=v.dataProp.url;
		console.log('http://finrep00.odobo.prod:5999/api-1.1?rpName=Xcron&fromCache=0');
	}
	*/
		
	for (var i=0;i<d.rowCount;i++) {
		var p = document.createElement("option");
		p.value = d.rows[i][_z.id];
		p.text = d.rows[i][_z.value];
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

