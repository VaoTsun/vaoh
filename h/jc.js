
/*
	http://stackoverflow.com/questions/12996871/why-does-typeof-array-with-objects-return-object-and-not-array
	
*/
var v ={
	  "delim" : '>>'	//'->'
	, "typeSeparator" : ":"
	, "jsons" : []
	, "acts" : []
	, "expanded" : []
	, "textPixels" : 10
	//, "cloneSign" : "&#8838;"
	, "cloneSign" : "<img src=\"../i/clone.png\" style=\"height:20px;width:20px;\">"
	, "oneSave" : false
};
var json = {};
var djson = {
	"first":"polotok"
	,"second":{
		"q":null
		,"e":345
		,"nextb":[
			{
    		"arr": "1",
    		"arr.field": {"age":32,"boolean.value" : null},
    		"arrb": [null,true,[[5],[6]],[7]]
		}
		,{
    		"arr": "2",
    		"arr.field": {"age":32,"boolean.value" : null},
    		"ar:rb": [null,true,[1,2,3],"String"]
		}
		]
		, "bob": {
    		name: "Bob",
    		"some.field": {"age":32,"boolean.value" : null},
    		"inner": [null,true,false]
		}
	}
	,"lop":false
	, "name.with.dot": [{"a":4},{"a":5}]
}

function blindToObjecT(o) {
	/*
		We intend to have dots in column names, so we use Array addressing in json objectss

	*/
	if (typeof(o) == 'undefined') {
		return false;
	}
	var path = o.split(v.delim);
	var bicycle = 'json';
	var bicycleParent = 'json';
	for (var i=0; i<path.length;i++) {
		if (path[i] != 'undefined') {
			bicycle += '["'+path[i]+'"]';
		}
		if (path[i] != 'undefined' && ( i+1 )<path.length) {
			bicycleParent += '["'+path[i]+'"]';
		}
	}
	return {"obj":bicycle,"dad":bicycleParent,"path":path,"key":path[path.length-1]};
}

function updateValue(parent,v) {
	if (v.tagName == 'TEXTAREA') {
		//console.log(v.innerHTML.length);
		var val = v.value;
	}
	else if (v.tagName == 'INPUT') {
		var val = v.value;
	}
	else  {
		return false;
	}
	//console.log(v, val);
	
	saveUndo('<u title=" '+blindToObjecT(parent).obj.replace(/"/g, '')+'">edit value</u>');
	if (parent.indexOf('json'+v.typeSeparator) > -1) {//if type is set => can be json as string => needs evaluation
		eval (blindToObjecT(parent).obj+'='+val+'');
		} else {
		eval (blindToObjecT(parent).obj+'="'+val+'"');
	}
	draw();
}

function updateKey(parent,value) {
	saveUndo('<u title=" '+blindToObjecT(parent).obj.replace(/"/g, '')+'">rename key</u>');
	eval (blindToObjecT(parent).dad+'["'+value+'"]='+blindToObjecT(parent).obj);
	eval ('delete '+blindToObjecT(parent).obj);
	/*
		Theoretically we could "order" json onload and do
		json=JSON.parse(JSON.stringify(json));
		but do we really want that?..
	*/
	draw();
	console.log(value,blindToObjecT(parent));
}

function saveUndo(act,once) {
	if (once == true && v.oneSave == true) {
		return null;	//we want only one save on clicking history steps 
	}
	var th = new Date();
	t = th.getTime();
	v.jsons[t] = JSON.parse(JSON.stringify(json));
	v.acts[t] = act;
	document.getElementById("h").innerHTML = '<BR>'
		+ '<u id="'+t+'" onclick="saveUndo(\'auto\',true);json = v.jsons[parseInt(this.id)];draw();return false;" style="font-size:10px;cursor:pointer;"> '
		+ String(100+th.getHours()).slice(-2)+':'+String(100+th.getMinutes()).slice(-2)+':'+String(100+th.getSeconds()).slice(-2)
		+ '&nbsp;' 
		+ v.acts[t]
		+' </u> &nbsp;'
		+ document.getElementById("h").innerHTML 
	;
	if (once == true) {
		v.oneSave = true;
		} else {
		v.oneSave = false;
	}
}

function showObject(o) {
	var co =  eval(blindToObjecT(o).obj);
	var po =  eval(blindToObjecT(o).dad);
	if (Object.prototype.toString.call(po) == '[object Array]') {
		if (Object.prototype.toString.call(co) == '[object Object]') {//do we have to "reparse" Array as well?.. 
			co = JSON.parse(JSON.stringify(co));	//dirty hack to clone object, not just readdress it
			var cko = 'Object'; 
			} else {
			var cko = 'Element'; 
		}
		saveUndo('<u title=" '+blindToObjecT(o).obj.replace(/"/g, '')+'"> '+cko+ ' clone </u>');
		po.push(co);
		draw();
	}
}

function toggle(o) {
	if (o.children[0].tagName == 'IMG') {
		o.children[0].style.cursor = 'pointer';
		if (o.children[0].src.slice(-5) == '+.png') {
			o.children[0].src = '../i/-.png';
			o.children[0].title = 'collapse';
			 } else {
			o.children[0].src = '../i/+.png';
			o.children[0].title = 'expand branch';
		}
	}
	
	for(var c=0;c<o.children.length;c++) {

		if (o.children[c].style.display == 'none') {
			if (o.children[c].tagName != 'IMG') {
				o.children[c].style.display = '';
				if (v.expanded.indexOf(o.id) < 0) {
					v.expanded.push(o.id);
				}
			}
		} 

		else if (o.children[c].style.display == '') {
			if (o.children[c].tagName != 'IMG' && o.id != 'undefined') {
				o.children[c].style.display = 'none';
			}
		}
		
		
	};
}

function concatHtmlObject(obj,parent) {
    if (obj === null || typeof obj !== 'object') {
    	if (String(obj).indexOf(String.fromCharCode(10)) > -1) {
    		var htmlShort = String(obj).substr(0,String(obj).substr(2).indexOf(String.fromCharCode(10))) + '... <sub>&#8618;</sub>';
    		var textArea = '<textarea title="'+parent+'" style="display:none;width:600px;height:'+Math.max(100,((v.textPixels*String(obj).split(String.fromCharCode(10)).length)))+'px;" >'+obj+'</textarea>';
    		} else {
    		var htmlShort = obj;
    		var textArea = '<input name="" title="'+parent+'" value="'+obj+'" style="display:none;" >';//onblur="this.style.display=\'none\';"
    	}
        return ' <i style="color:purple;" ondblclick="this.parentNode.children[5].style.display=\'\';this.parentNode.children[6].style.display=\'\';this.style.display=\'none\';" >'
        	+ htmlShort
        	+ '</i>'
        	+ textArea
        	+ '<input value="OK" onclick="updateValue(\''+parent+'\',this.parentNode.children[5]);" style="display:none;" type="button">'
        	;
    }
 	var k = Object.keys(obj);
	var r = '<UL id="'+parent+'" ><img src="../i/+.png" onclick="toggle(this.parentNode);" title="expand branch">';
   	for (var key in obj) {
   		//console.log(v.expanded.indexOf(parent),parent);
   		if (typeof(parent) == 'undefined' || v.expanded.indexOf(parent) > -1) {
   			var disp = ''; 
   			} else {
   			var disp = 'display:none;'; 
   		}
    	r += '<LI id="'+parent+v.delim+key+'" style="'+disp+'white-space:nowrap;width:1000px;">';
   		if ( typeof(obj[key]) == 'object' && obj[key] != null) {
   			if (Object.prototype.toString.call(eval(blindToObjecT(parent).obj)) == '[object Array]') {
   				//console.log(parent,obj);
   				var ar = 'array';
    			var sg = '<a href="" class="clone" onclick="showObject(\''+parent+v.delim+key+'\');return false;" title="Clone this array element (which is Object) to the end of array.">'+v.cloneSign+'</a>';
  				} else {
   				var ar = 'object';
   				var sg = '';
   				//console.log(obj);
   			}
  			var e = '<i style="color:black;white-space:nowrap;" >'+sg+'</i>';
    		} else {
   			if (Object.prototype.toString.call(eval(blindToObjecT(parent).obj)) == '[object Array]') {
   				//console.log(parent,obj);
   				var ar = 'array';
   				var sg = '<a href="" class="clone" onclick="showObject(\''+parent+v.delim+key+'\');return false;">+[]</a>';
   				} else {
   				var ar = 'object';
   				var sg = '';   			}
  			var e = '<i style="white-space:nowrap;" >'+sg+'</i>';
    	}
    	if (Object.prototype.toString.call(eval(blindToObjecT(parent).obj)) == '[object Array]') {
    		var htmlKey = '<b class="'+ar+'" ondblclick="showMessage(\'You can\\\'t rename array key\');">'+key+'</b>';
    		}else {
			var htmlKey = '<b class="'+ar+'" ondblclick="this.parentNode.children[1].style.display=\'\';this.parentNode.children[2].style.display=\'\';this.style.display=\'none\';">'+key+'</b>:'
				+ '<input value="'+key+'" style="display:none;" >'
				+ '<input value="OK" onclick="updateKey(\''+parent+v.delim+key+'\',this.parentNode.children[1].value);" style="display:none;" type="button">'
			;
    	}
		if (typeof(parent) == 'undefined') {
			r += ''+htmlKey+'' + e + concatHtmlObject(obj[key],''+key+'');
			} else {
				if (key.indexOf(v.typeSeparator) > 0) {
					r += htmlKey + e + concatHtmlObject(JSON.stringify(obj[key],null,2),''+parent+v.delim+key+'');
					} else {
					r += htmlKey + e + concatHtmlObject(obj[key],''+parent+v.delim+key+'');
				}
		}
		r += '';
    }
 	r+='</UL>';
    return r;
}

function draw() {
	document.getElementById('t').value = JSON.stringify(json,null,2);
	document.getElementById('f').innerHTML = concatHtmlObject(json);

}

function showMessage(s) {
	document.getElementById('helpP').style.display = '';
	document.getElementById('mess').innerHTML=s;
	setTimeout(function () {
			document.getElementById('helpP').style.display = 'none';
		},2000
	);

}

function IsJsonString(str) {
	var m = new Object({"exc" : "not json","string":str,"obj":{}});
    try {
        var r = JSON.parse(str);
    } catch (e) {m.exc = e;
        return m;
    }
    return new Object({"obj":r,"string":JSON.stringify(str,null,2)});
}
