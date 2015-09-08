
var vars = { 
	  "reFreshEvery": 5000
	, "dryOut" : 500
	, "x" : 19
	, "y" : 9
	, "lazyVar": {"recentObjects":[]}
	, "plopText" : "plop"
	, "dryText" : [""]//["cannabis","cocaine","ecstasy","heroin","meth","LSD", "mushrooms-mishrooms","joint"]
	, "wetText" : ["plop","drip","splash","splot","plink","pitter-patter", "glop"]	/*	http://www.writtensound.com/index.php?term=liquid	*/
	, "initText" : [""]
	, "styles": {
		  "defaultColor":"#449977"
		, "plop" : {
			  "opacity": 0.7
			, "borderColor": "#FF0000"
			, "backgroundColor": "#aabbff"
			, "color": "red"
		}
		, "calm" : {
			  "opacity": 1.0
			, "borderColor": "#FFFFFF"
			, "backgroundColor": "#ffFFff"
			, "color": "#990000"
		}
		, "init" : {
			  "opacity": 1.0
			, "borderColor": "#FFFFFF"
			, "borderWidth": 2
			, "borderStyle": "solid"
			, "backgroundColor": "#ffFFff"
			, "color": "#000000"
			, "width": 50
			, "height": 50
			, "text-align" : "center"
		}


	}
	, "version":0.4
};

function applyStyles(_o,_s) {
	var _k = Object.keys(_s);
	for (var _i=0;_i<_k.length;_i++) {
		_o.style[_k[_i]]=_s[_k[_i]];
	}
}

function makeItLook() {
	var _ta = shuffle(eval(vars.lazyVar.recentObjects));
	//console.log(_ta);
	for (var i=0;i<vars.lazyVar.recentObjects.length;i++) {
		/* dynamic parametrisation needed */
		var _r = Math.random()*100;
		_r = String(_r).substr(0,2);
		_r = parseInt(_r)*50;
		setTimeout(
			function() {
				var _o = document.getElementById(_ta[0]);
				if (_o != null && typeof(_ta[0]) != 'undefined') {
					applyStyles(_o,vars.styles.plop);
					var _pa=_ta[0];
				/*	http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript	*/
				_o.innerHTML=vars.wetText[Math.floor(Math.random() * vars.wetText.length) + 0];
				}
				setTimeout(
					function() {
						var _o = document.getElementById(_pa);
						if (_o != null ) {
							applyStyles(_o,vars.styles.calm);
							//_o.innerHTML=vars.dryText;
							_o.innerHTML=vars.dryText[Math.floor(Math.random() * vars.dryText.length) + 0];
						}
					}
					,  vars.dryOut
				);
				_ta.shift();
			}	
			, (vars.reFreshEvery  - _r)
		);
	}
	vars.lazyVar.recentObjects=[];
	setTimeout(function() {
		document.getElementById("o").innerHTML='';
		createTable();
		makeItLook();
		}
		, 4000
	);
}

function shuffle(array) {
	//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function createTable() {
	var x = vars.x;
	var y = vars.y;
	var table = document.createElement("TABLE"); 
	for (var i=0;i<y;i++) {
		var tr = document.createElement("TR"); 
		for (var e=0;e<x;e++) {
			var text = document.createTextNode(vars.initText[Math.floor(Math.random() * vars.initText.length) + 0]); 
			var td = document.createElement("TD"); 
			td.appendChild(text);
			td.id = 'tr'+i+'td'+e;
			applyStyles(td,vars.styles.init);
			vars.lazyVar.recentObjects.push(td.id);
			tr.appendChild(td); 
		}
		table.appendChild(tr); 
	}
	document.body.appendChild(table);
	return true;	
}

function onLoad() {
	createTable();
	makeItLook();
}








window.onload=onLoad;




























