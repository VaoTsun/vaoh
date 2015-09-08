$(function() {
	var StartTime=microtime(true);
	var $_GET = {};
	var mTime;

if(document.location.toString().indexOf('?') !== -1) {
    var query = document.location.toString().replace(/^.*?\?/, '').split('&');

    for(var i=0, l=query.length; i<l; i++)
    {
       var aux = decodeURIComponent(query[i]).split('=');
       $_GET[aux[0]] = aux[1];
    }
}
	/* Defaults */
	if (typeof($_GET['sess_back']) == 'undefined') {
		$_GET['sess_back']=Math.max(1,0);
	}
	if (typeof($_GET['disk_back']) == 'undefined') {
		$_GET['disk_back']=Math.max(2,0);
	}

	//console.log($_GET);
	var mbdata = [];
	var xsdata = [];
	var cpudata = [];
	var data_active = [];
	var data_idle = [];
	var data_locks = [];
	var ram_data = [];
	var hdd_data  = [];

	var TableData = [];

	
	var data;
	var options;
	var pauseUpdate = false;

	var SessionsPlot;
	var SessionsData;
	var SessionsOptions;
	
	var SessionYaxeMax = 10;
	var SessionsActiveLocksYaxeMax = 100;
	var SessionsIdleSessionsYaxeMax = 50;
	
	function LoadVariables() {
		var defaults = JSON.parse($("#defaults").html());
		jQuery.each(defaults, function(i, valueis) {
			if (typeof($_GET[i]) =='undefined') {
				$_GET[i] = valueis;
				$("#IamZiForm").append('<input type="hidden" name="'+i+'" value="'+valueis+'" />');
				} else {
				if (typeof($('input[name="'+i+'"]').val()) =='undefined') {
					$("#IamZiForm").append('<input type="hidden" name="'+i+'" value="'+$_GET[i]+'" />');
				}
			}
		});
		
		return true;
	}

	LoadVariables();

	function GbFormatter(v, axis) {
		return v.toFixed(axis.tickDecimals) + " GB";
	}
	
	function MbFormatter(v, axis) {
		return v.toFixed(axis.tickDecimals) + " MB";
	}

	function GetData(data_url,data_type) {
		var ExecStartTime=microtime(true);
		if (typeof(data_type) === "undefined") { data_type = "json"; }
		$.ajax({
			async: false,
			url: data_url,
			type: "GET",
			dataType: data_type,
			success: 
				function (series){
					//console.log(data_url);
					data = eval(series),	totalPoints = 30; 
				}
		});
		if (microtime(true) - ExecStartTime > 0.2) {
			console.log(data_url);
			console.log(microtime(true) - ExecStartTime);
		}
		if ( !data) {
			console.log(data_url+' ('+data_type+') returns no data');
		}
		return data;
	}
	
	var updateInterval = 4*1000;
	$("#updateInterval").val(updateInterval).change(function () {
		var v = $(this).val();
		if (v && !isNaN(+v)) {
			updateInterval = +v;
			if (updateInterval < 1) {
				updateInterval = 1;
			} else if (updateInterval > 2000) {
				updateInterval = 2000;
			}
			$(this).val("" + updateInterval);
		}
	});


	function updateAll(updateAllInterval,pauseUpdateAll,functionName) {
		if (pauseUpdateAll) {
			return false;
		}
		eval(functionName);
		//setTimeout(updateAll(updateAllInterval,pauseUpdateAll,functionName), 2000);
	}
	
	var PlatformCheck = {
		  url: "http://testdb1.odobo.local/tool/manitou.alerts.proxy.php?Name=PlatformVersion"
		, id: 5
		, type: "json"
		, keyName: "Platform"	/* json key that holds a string to compare against */
		, pattern: "Platform version is [0-9]{1,3}(.)[0-9]{1,3}(.)[0-9]{1,3}"
		, success: function () {showHeart(this.id,'OK','Platform state heart');}
		, failure: function () {showHeart(this.id,'warning');console.log('failure - pattern not found');}
		, interval: 60*1000	/*	in milliseconds	*/
	}

	var JarvisPursuitCheck = {
		  url: 'http://testdb1.odobo.local/tool/manitou.alerts.proxy.php?Name=JarvisPursuit'
		, id: 8
		, type: "json"
		, keyName: "alert_in"/* json key that holds a string to compare against */
		, pattern: p = function () {	
			return "(-){1}[0-9]{0,4}";
			}
		, success: function () {showHeart(this,'OK','jarvis state');}
		, failure: function () {showHeart(this,'warning','jarvis_pursuit is too old!');console.log('failure - pattern not found');}
		, interval: 3600*1000	/*	in milliseconds	*/
	}
	

	function CheckResponse(arg) {
		var _r = GetData(arg.url,arg.type);
		if (!_r) {
			console.log('	::Problem loading "'+arg.url+'"');
			return false;
		}
		_r=eval('_r.'+arg.keyName);
		if (!_r) {
			return false;
		}
		/*
		if (typeof(_r)=='undefined') {
			_r='fc';
		}
		*/
		if (typeof(arg.pattern) == 'function') {
			arg.pattern = arg.pattern();
		}
		var _re = new RegExp(arg.pattern, 'g');
		if (typeof(_r)=='number') {
			_r=_r.toString();	/* we are comparing regexp - want a string hate js*/
		}
		var _m = String(_r).match(_re);
		if (_r.match(_re)) {
			arg.success();
			} else {
			console.log(typeof(arg.pattern),arg.pattern,_r,'No match... :/');
			arg.failure();
		}
		setTimeout(function() {CheckResponse(arg);},arg.interval);
	}
	
	function showHeart(_obj,_state,_c) {
		var _id=_obj.id;
		var _html='<a href="" onclick="window.open(\''+_obj.url+'\');return false;">'
			+'<img id="heart_image_'+_id+'"></a>'
			+'<i id="last_check_'+_id+'" style="font-size:7px;color:green;"></i>';
		$('#ts3').html($('#ts3').html()+_html);
		var _o = $("#heart_image_"+_id);
		if (_state == 'warning') {
			_src='i/redheart.gif';
		}
		if (_state == 'OK') {
			_src='i/greenheart.gif';
		}
		_o.attr('src', _src);
		_o.attr('title', _c);
		_o.css('width','20px');
		_o.css('height','20px');
		drawHeart(0,_id);
		return true;
	}
	
	function drawHeart(_t,_id) {
		var _t = _t +1;
		$('#last_check_'+_id).html(_t);
		setTimeout(function() {drawHeart(_t,_id);},1000);
	}
	
	CheckResponse(PlatformCheck);
	CheckResponse(JarvisPursuitCheck);
	
	function CheckWesley(MaxDifSecondsToWarn) {
		MaxDifSecondsToWarn = $_GET["WesleyMax"];
		var ExecStartTime=microtime(true);
		wesley_data = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=last_jar','json');
		wesley_data = wesley_data.data[0];
		var color = 'green';
		LastSeenSeconds=Math.round(ExecStartTime - wesley_data.round);
		
		if (LastSeenSeconds > MaxDifSecondsToWarn || LastSeenSeconds < 0 ) {
			color = 'red';
			document.getElementById("heart_image_1").src='i/redheart.gif';
			} else {
			$("#heart_image_1").attr('src', 'i/greenheart.gif');
			document.getElementById("heart_image_1").src='i/greenheart.gif';
		}
		//console.log(LastSeenSeconds);
		$("#status_button_1").prop('title', '' + wesley_data.sec + ' seconds for ' + wesley_data.val +' rows seen at ' + LastSeenSeconds + ' seconds ago');
		$("#status_button_1").css({ color: color });
		$("#timetook_1").html(wesley_data.sec);
		$("#sessions_1").html(wesley_data.val);
		$("#lastseen_1").html(LastSeenSeconds);
		$("#reftime_1").html(wesley_data.ts);
		$("#heart_det_span_1").html(LastSeenSeconds);
		
		setTimeout(function() {CheckWesley($_GET["WesleyMax"])}, 1000);
		return null;
	
	}

	function CheckOpsos(MaxDifSecondsToWarn) {
		MaxDifSecondsToWarn = $_GET["WesleyMax"];
		var ExecStartTime=microtime(true);
		opsos_data = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=last_opsos','json');
		opsos_data = opsos_data.data[0];
		var color = 'green';
		LastSeenSeconds=Math.round(ExecStartTime - opsos_data.round);
		
		if (LastSeenSeconds > MaxDifSecondsToWarn || LastSeenSeconds < 0 ) {
			color = 'red';
			document.getElementById("heart_image_1").src='i/redheart.gif';
			} else {
			$("#heart_image_1").attr('src', 'i/greenheart.gif');
			document.getElementById("heart_image_1").src='i/greenheart.gif';
		}
		//console.log(LastSeenSeconds);
		$("#status_button_1").prop('title', '' + opsos_data.sec + ' seconds for ' + opsos_data.val +' rows seen at ' + LastSeenSeconds + ' seconds ago');
		$("#status_button_1").css({ color: color });
		$("#lastseen_1").html(LastSeenSeconds);
		$("#reftime_1").html(opsos_data.ts);
		$("#heart_det_span_3").html(opsos_data.msg);
		/*
		*/
		setTimeout(function() {CheckOpsos($_GET["WesleyMax"])}, 1000);
		return null;
	
	}

	function CheckBlocks(MaxDifSecondsToWarn) {
		wMaxDifSecondsToWarn = $_GET["BlockingMax"];
		var wExecStartTime=microtime(true);
		var wurl = 'http://testdb1.odobo.local/tool/manitou.src.php?hostname='+$_GET['hostname']+'&src=blocking_locks&BlockingMax='+wMaxDifSecondsToWarn;
		//console.log(wurl);
		wblocker_data = GetData(wurl,'text');
		wblocker_data = wblocker_data[0];
		//wLastSeenSeconds=Math.round(wExecStartTime - wblocker_data);
		//console.log(wblocker_data); 
		//console.log(wLastSeenSeconds); 
		
		var wcolor = 'green';
		if (wblocker_data[0] > 0 ) {
			wcolor = 'red';
			document.getElementById("heart_image_2").src='i/redheart.gif';
			} else {
			$("#heart_image_2").attr('src', 'i/greenheart.gif');
		}
		$("#status_button_2").css({ color: wcolor });
		$("#status_button_2").click(function() {window.open(wurl+'&t=text');});
		//$("#heart_det_span_2").html(wLastSeenSeconds);
		
		setTimeout(function() {CheckBlocks($_GET["BlockingMax"])}, 1000);
		return null;
	
	}
	
	//updateAll(2000,false,'CheckWesley(50)');
	
	CheckWesley(50);
	CheckBlocks(50);
	CheckOpsos(50);
	
	function update() {
		LoadVariables();
		if (pauseUpdate) {
			return false;
		}
			// Since the axes don't change, we don't need to call plot.setupGrid()
		var ExecStartTime=microtime(true);
		data_active = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=active&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back']);
		data_idle = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=idle&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back']);
		data_locks = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=locks&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back']);
		cpudata = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=cpu&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back']);
		ram_data = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=ram&hostname='+$_GET['hostname'],'text');
		hdd_data = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=RamWindowsStyle&t=ram&hostname='+$_GET['hostname'],'text');
		swap_data = GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=RamWindowsStyle&t=swap&hostname='+$_GET['hostname'],'text');

		//console.log('http://testdb1.odobo.local/tool/manitou.src.php?src=cpu&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back']);
		if (typeof($_GET['SessionYaxeMax']) !='undefined') {
			SessionYaxeMax = Math.max(parseInt($_GET['SessionYaxeMax']),100);
		}
		if (typeof($_GET['SessionsActiveLocksYaxeMax']) !='undefined') {
			SessionsActiveLocksYaxeMax = Math.max(parseInt($_GET['SessionsActiveLocksYaxeMax']),100);
		}
		if (typeof($_GET['SessionsIdleSessionsYaxeMax']) !='undefined') {
			SessionsIdleSessionsYaxeMax = Math.max(parseInt($_GET['SessionsIdleSessionsYaxeMax']),50);
		}

	/*
	$("#placeholder").bind("plothover", function (event, pos, item) {

		if ($("#enablePosition:checked").length > 0) {
			var str = "(" + pos.x.toFixed(2) + ", " + pos.y.toFixed(2) + ")";
			$("#hoverdata").text(str);
		}

		if ($("#enableTooltip:checked").length > 0) {
			if (item) {
				var x = item.datapoint[0].toFixed(2),
					y = item.datapoint[1].toFixed(2);

				$("#tooltip").html(item.series.label + " of " + x + " = " + y)
					.css({top: item.pageY+5, left: item.pageX+5})
					.fadeIn(200);
			} else {
				$("#tooltip").hide();
			}
		}
	});
	*/
	//console.log(hdd_data);

			position = "right";
			SessionsData = [
					{ 
						data: data_active
						, label: "active sessions"
						, color: "green" 
						, opacity: 0.8
						, yaxis: 1 
						, lines: { show: true, fill: true}
					}
					,
					{ 
						  data: cpudata
						, label: "CPU"
						, color: "brown" 
						, yaxis: 4 
						, points: {
							show: false
							, radius: 8
						}
						, lines: { show: true, fill: false, lineWidth: 3 }
						, shadowSize: 4
					}
					,
					{ 
						data: data_idle
						, label: "idle sessions"
						, color: "orange" 
						, yaxis: 2 
						, lines: { show: true, fill: true }
					}
					,
					{ 
						data: data_locks
						, label: "active locks"
						, color: "#FF6600" 
						, yaxis: 3 
						, lines: { show: true, fill: true }
						//, curvedLines: { apply: true}
					}
				]
			;
			SessionsOptions = {
							series: 
							{
								lines: {
									show: true
									}
						//,
						//points: {
						//	show: true
						//}
					},
					grid: {
						hoverable: true,
						clickable: true
					}
					,xaxes: [ 
						{ 
						mode: "time" 
						,	tickLength: 5
						//,	timeZoneOffset: (new Date()).getTimezoneOffset()
						//,	timezone: "browser"
						//,	useLocalTime: true
						,	timezone: "browser"
						//,	timeformat: "%Y.%m.%d"
						} ]
					,
					yaxes: [ 
						  {
							  min: $_GET["Yn1"]
							, max: $_GET["Yx1"]
							, alignTicksWithAxis: position == "right" ? 1 : null
							, position: 'left'
							, tickFormatter: ''
							, tickDecimals: 0
							, ticks: 10
							, font: 
								{
								color: "green"
								, style: "italic"
								}
						} 
						, {
							  min: $_GET["Yn2"]
							, max: $_GET["Yx2"]
							, alignTicksWithAxis: position == "right" ? 1 : null
							, position: 'left'
							, tickFormatter: ''
							, tickDecimals: 0
							, tickSize: 20
							, ticks: [0, 20, 50, 100]
							, font: 
								{
								color: "orange"
								, style: "italic"
								}
							, color: 'orange'
						} 
						, {
							  min: $_GET["Yn3"]
							, max: $_GET["Yx3"]
							// align if we are to the right
							, alignTicksWithAxis: position == "right" ? 1 : null
							, position: position
							, tickFormatter: ''
							, font: 
								{
								color: "#FF6600"
								}
							, autoscaleMargin: 0.2
							//, transform: function (v) { return -v; }
							//, inverseTransform: function (v) { return -v; }
						} 
						, {
							  min: $_GET["Yn4"]
							, max: $_GET["Yx4"]
							, position: 'right'
							, tickFormatter: ''
							, color: 'brown'
						} 
					]
					,
					legend: { 
						position: "nw" 
						, backgroundOpacity: 0.5
					}
					, selection: {
							mode: "x"
						}
				}
			;
			
			SessionsPlot = $.plot("#placeholder", SessionsData , SessionsOptions);
			

			SessionsPlot.draw();

			$( "#try" ).removeAttr( "style" ).hide().fadeIn();
			$("#placeholder div.legend table").css({ border: "1px solid #888888", background: "#ffffee", "font-size": '9px' });

    // now for each axis, create a div
    $.each(SessionsPlot.getAxes(), function (i, axis) {
        if (!axis.show)
            return;
        
        var box = axis.box;
        
        $('<div class="axisTarget" style="position:absolute;left:' + box.left + 'px;top:' + box.top + 'px;width:' + box.width +  'px;height:' + box.height + 'px" title="'+axis.max+'">qwe</div>')
            .data('axis.direction', axis.direction)
            .data('axis.n', axis.n)
            .css({ backgroundColor: "#f00", opacity: 0, cursor: "pointer" })
            .appendTo(SessionsPlot.getPlaceholder())
            .hover(
                function () { $(this).css({ opacity: 0.10 }) },
                function () { $(this).css({ opacity: 0 }) }
            )
            .click(function (e) {
                //$("#AxisProperties").text("You clicked the " + axis.direction + axis.n + "axis!");
                var x = e.clientX;
        		var y = e.clientY;
                $("#AxisPropertiesMax").val(axis.max);
                $("#AxisPropertiesMax").css({backgroundColor:"#ffaa00", color: "#000000", zIndex:99 });
                
                $("#AxisPropertiesMin").val(axis.min);
                $("#AxisPropertiesMin").css({backgroundColor:"orange", zIndex:99 });
                $("#AxisProperties").css({display:'', zIndex:99, position:"absolute",left:x+20,top:y+20 });
                
                
                $("#AxisPropertiesMax").change(function(){ var cuurval=$("#AxisPropertiesMax").val();$('input[name="'+'Yx'+axis.n+'"]').val(cuurval);$("#IamZiForm").submit(); });
                $("#AxisPropertiesMin").change(function(){ var cuurval=$("#AxisPropertiesMin").val();$('input[name="'+'Yn'+axis.n+'"]').val(cuurval);$("#IamZiForm").submit(); });
                
                //$("#IamZiForm").submit();
                console.log(axis);
            }
        );
                	
    });
    
    
			

	/*
	////////
			//$( "#circle" ).fadeOut((updateInterval/3)-1,callback());
	function callback() {
		  setTimeout(function() {
			$( "#circle" ).removeAttr( "style" ).hide().fadeIn();
		  }, 599 );
		};
	function runEffect() {
      var options = {};
      
      $( "#circle" ).effect( 'fade', options, 10, callback );
    };
    
    //$( "#try" ).fadeOut(200);
    //runEffect();
    /////////////
*/
			
/*   pie  */


		var placeholder = $("#placeholder");


		$.plot('#ram', ram_data, {
			series: {
				pie: {
					show: true,
					combine: {
						color: '#999'
						, threshold: 0.01
					}
					, tilt: 1.0
					, innerRadius: 0.65
					, background: 
						{
						color: 'orange'
                    	, opacity: 0.2
                		}
				}
			},
			legend: {
				show: false
			}
		});
		$.plot('#hdd', hdd_data, {
			series: 
				{
				pie: 
					{
					show: true,
					combine: {
						color: '#999'
						, threshold: 0.01
					}
					, tilt: 1.0
					, innerRadius: 0.50
					, label: 
						{
						show: true
						, radius: 1/4
						, formatter: labelFormatter
						, background: 
							{
                    		opacity: 0.00
                    		, color: '#fff'
							}
						}
					, background: 
						{
                    	opacity: 0.4
                		}
					}
				}
				, legend: 
					{
					show: false
					}
				}
			);

		$.plot('#swap', swap_data, {
			series: 
				{
				pie: 
					{
					show: true,
					combine: {
						color: '#999'
						, threshold: 0.01
					}
					, tilt: 1.0
					, innerRadius: 0.92
					, label: 
						{
						show: false
						, radius: 1/4
						, formatter: labelFormatter
						, background: 
							{
                    		opacity: 0.00
                    		, color: '#fff'
							}
						}
					, background: 
						{
                    	opacity: 0.4
                		}
					}
				}
				, legend: 
					{
					show: true
					, position: "ne"
					}
				}
			);
/*
*/	
 		console.log(microtime(true) - ExecStartTime);
   
	function labelFormatter(label, series) {
		return "<div style='font-size:8pt; text-align:center; padding:2px;color:" + series.color + ";'>" + label + "<br/>" + Math.round(series.percent) + "%</div>";
	}
	

		if ('Pulsate on Refresh'!='') {
/*
		setTimeout(function(){$("#placeholder").css("opacity", "0.05");}, 50);
		setTimeout(function(){$("#placeholder").css("opacity", "0.10");}, 100);
		setTimeout(function(){$("#placeholder").css("opacity", "0.15");}, 150);
		setTimeout(function(){$("#placeholder").css("opacity", "0.20");}, 200);
		setTimeout(function(){$("#placeholder").css("opacity", "0.25");}, 250);
		setTimeout(function(){$("#placeholder").css("opacity", "0.30");}, 300);
		setTimeout(function(){$("#placeholder").css("opacity", "0.35");}, 350);
		setTimeout(function(){$("#placeholder").css("opacity", "0.40");}, 400);
		setTimeout(function(){$("#placeholder").css("opacity", "0.45");}, 450);
		setTimeout(function(){$("#placeholder").css("opacity", "0.50");}, 500);
		setTimeout(function(){$("#placeholder").css("opacity", "0.55");}, 550);
*/		
		setTimeout(function(){$("#placeholder").css("opacity", "0.60");}, 100);
		setTimeout(function(){$("#placeholder").css("opacity", "0.65");}, 150);
		setTimeout(function(){$("#placeholder").css("opacity", "0.70");}, 200);
		setTimeout(function(){$("#placeholder").css("opacity", "0.75");}, 250);
		setTimeout(function(){$("#placeholder").css("opacity", "0.80");}, 300);
		setTimeout(function(){$("#placeholder").css("opacity", "0.85");}, 350);
		setTimeout(function(){$("#placeholder").css("opacity", "0.90");}, 400);
		setTimeout(function(){$("#placeholder").css("opacity", "0.95");}, 450);
		setTimeout(function(){$("#placeholder").css("opacity", "1.0");}, 500);

		$("#hdd").css("opacity", "0.0");
		setTimeout(function(){$("#hdd").css("opacity", "0.05");}, 50);
		setTimeout(function(){$("#hdd").css("opacity", "0.10");}, 100);
		setTimeout(function(){$("#hdd").css("opacity", "0.15");}, 150);
		setTimeout(function(){$("#hdd").css("opacity", "0.20");}, 200);
		setTimeout(function(){$("#hdd").css("opacity", "0.25");}, 250);
		setTimeout(function(){$("#hdd").css("opacity", "0.30");}, 300);
		setTimeout(function(){$("#hdd").css("opacity", "0.35");}, 350);
		setTimeout(function(){$("#hdd").css("opacity", "0.40");}, 400);
		setTimeout(function(){$("#hdd").css("opacity", "0.45");}, 450);
		setTimeout(function(){$("#hdd").css("opacity", "0.50");}, 500);
		setTimeout(function(){$("#hdd").css("opacity", "0.55");}, 550);
		setTimeout(function(){$("#hdd").css("opacity", "0.60");}, 600);
		setTimeout(function(){$("#hdd").css("opacity", "0.65");}, 650);
		setTimeout(function(){$("#hdd").css("opacity", "0.70");}, 700);
		setTimeout(function(){$("#hdd").css("opacity", "0.75");}, 750);
		setTimeout(function(){$("#hdd").css("opacity", "0.80");}, 800);
		setTimeout(function(){$("#hdd").css("opacity", "0.85");}, 850);
		setTimeout(function(){$("#hdd").css("opacity", "0.90");}, 900);
		setTimeout(function(){$("#hdd").css("opacity", "0.95");}, 950);
		setTimeout(function(){$("#hdd").css("opacity", "1.0");}, 1000);

		setTimeout(function(){$("#ram").css("opacity", "0.05");}, 350);
		setTimeout(function(){$("#ram").css("opacity", "0.10");}, 400);
		setTimeout(function(){$("#ram").css("opacity", "0.15");}, 450);
		setTimeout(function(){$("#ram").css("opacity", "0.20");}, 500);
		setTimeout(function(){$("#ram").css("opacity", "0.25");}, 550);
		setTimeout(function(){$("#ram").css("opacity", "0.30");}, 600);
		setTimeout(function(){$("#ram").css("opacity", "0.35");}, 650);
		setTimeout(function(){$("#ram").css("opacity", "0.40");}, 700);
		setTimeout(function(){$("#ram").css("opacity", "0.45");}, 750);
		setTimeout(function(){$("#ram").css("opacity", "0.50");}, 800);
		setTimeout(function(){$("#ram").css("opacity", "0.55");}, 850);
		setTimeout(function(){$("#ram").css("opacity", "0.60");}, 900);
		setTimeout(function(){$("#ram").css("opacity", "0.65");}, 950);
		setTimeout(function(){$("#ram").css("opacity", "0.70");}, 1000);
		setTimeout(function(){$("#ram").css("opacity", "0.75");}, 1050);
		setTimeout(function(){$("#ram").css("opacity", "0.80");}, 1100);
		setTimeout(function(){$("#ram").css("opacity", "0.85");}, 1150);
		setTimeout(function(){$("#ram").css("opacity", "0.90");}, 1200);
		setTimeout(function(){$("#ram").css("opacity", "0.95");}, 1250);
		setTimeout(function(){$("#ram").css("opacity", "1.0");}, 1300);

		setTimeout(function(){$("#swap").css("opacity", "0.05");}, 550);
		setTimeout(function(){$("#swap").css("opacity", "0.10");}, 600);
		setTimeout(function(){$("#swap").css("opacity", "0.15");}, 650);
		setTimeout(function(){$("#swap").css("opacity", "0.20");}, 700);
		setTimeout(function(){$("#swap").css("opacity", "0.25");}, 750);
		setTimeout(function(){$("#swap").css("opacity", "0.30");}, 800);
		setTimeout(function(){$("#swap").css("opacity", "0.35");}, 850);
		setTimeout(function(){$("#swap").css("opacity", "0.40");}, 900);
		setTimeout(function(){$("#swap").css("opacity", "0.45");}, 950);
		setTimeout(function(){$("#swap").css("opacity", "0.50");}, 1000);
		setTimeout(function(){$("#swap").css("opacity", "0.55");}, 1050);
		setTimeout(function(){$("#swap").css("opacity", "0.60");}, 1100);
		setTimeout(function(){$("#swap").css("opacity", "0.65");}, 1150);
		setTimeout(function(){$("#swap").css("opacity", "0.70");}, 1200);
		setTimeout(function(){$("#swap").css("opacity", "0.75");}, 1250);
		setTimeout(function(){$("#swap").css("opacity", "0.80");}, 1300);
		setTimeout(function(){$("#swap").css("opacity", "0.85");}, 1350);
		setTimeout(function(){$("#swap").css("opacity", "0.90");}, 1400);
		setTimeout(function(){$("#swap").css("opacity", "0.95");}, 1450);
		setTimeout(function(){$("#swap").css("opacity", "1.0");}, 1500);
		
		}
		
		
			setTimeout(update, updateInterval);
			//console.log(microtime(true));
		}

		update();
		


		///////	SELECTING SOME INTERVAL
		$("#placeholder").bind("plotselected", function (event, ranges) {

			$("#selection").text(ranges.xaxis.from.toFixed(1) + " to " + ranges.xaxis.to.toFixed(1));

			SessionsPlot = $.plot($("#placeholder"), SessionsData, $.extend(true, {}, SessionsOptions, {
				xaxis: {
					min: ranges.xaxis.from,
					max: ranges.xaxis.to
				}
			}));
			pauseUpdate=true;
			BlinkPause();
			console.log(pauseUpdate);
		});

	/*
	I wish i use this instead of reload the whole page to switch pause of, but it does not work :)
	*/
	
	$("#pause_sign").click(function () {
		console.log(':)');
		pauseUpdate=false;
		//SessionsPlot.clearSelection();
		update();
	});


	$("#placeholder").bind("plotclick", function (event, pos, item) {
		$( "#DotValues" ).html('');
		$("#FileList").html('');
		$( "#FileContent" ).html('');
		if (item) {
			var ts = item.series.data[item.dataIndex][0];
			mTime = ExternalDataTable('http://testdb1.odobo.local/tool/manitou.src.php?src=mtime&ts='+ts+'&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back']);
			mTime = mTime.data[0].mtime;
			console.log('mTime:: ' + mTime);
			DataTable(item.series.label,ts);
			makeTableHTML(TableData,item.series.color,mTime);
			console.log(TableData.length);
			var d=ExternalDataTable('http://testdb1.odobo.local/tool/manitou.src.php?src=file_list_mtime&mtime='+mTime+'&hostname='+$_GET['hostname']);
			FileList= TemporarymakeTableHTML(d,'brown');
			$("#clickdata").html('<div style="font-size:12px;color:'+item.series.color+';" onclick="ShowHide(getElementById(\'Blya\'));">'+item.series.label + ' on ' + timeConverter(item.series.data[item.dataIndex][0]) + ' </div>');
			$("#DotValues").html('<br><div style="font-size:12px;color:'+item.series.color+';">' + DotValues + '</div>' );
			$("#FileList").html('<br><div style="font-size:12px;color:'+item.series.color+';width:800px;">' + FileList + '</div>' );
			
		}
	});

	function BlinkPause() {
		if (!pauseUpdate) {
			$( "#pause_sign" ).hide();
			return null;
		}
		$( "#pause_sign" ).hide().fadeIn();
		//$( "#pause_sign" ).fadeOut(400);
		setTimeout(BlinkPause, 1000);
	}

	function microtime(get_as_float) {
		var now = new Date()
		.getTime() / 1000;
		var s = parseInt(now, 10);
		return (get_as_float) ? now : (Math.round((now - s) * 1000) / 1000) + ' ' + s;
	}

	function timeConverter(UNIX_timestamp){
	 var a = new Date(UNIX_timestamp);
	 var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
		 var year = a.getFullYear();
		 var month = months[a.getMonth()];
		 var date = a.getDate();
		 var hour = a.getHours();
		 var min = a.getMinutes();
		 var sec = a.getSeconds();
		 var time = ' '+year+'.'+a.getMonth()+'.'+date+' '+hour+':'+min+':'+sec ;
		 return time;
	 }

	function hddFlat(position) {
		
		InitiatingMonthData	= GetData('http://testdb1.odobo.local/tool/manitou.src.php?act=InitMeminfo&hostname='+$_GET['hostname']+'&disk_back='+$_GET['disk_back'],'json');

		hddFlatTotal_data 	= GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=hddFlat&t=total&hostname='+$_GET['hostname'],'text');
		hddFlatUsed_data 	= GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=hddFlat&&t=used&hostname='+$_GET['hostname'],'text');
		MemoryTotalFlat 	= GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=memoryFlat&t=tot&hostname='+$_GET['hostname'],'text');
		MemoryUsedFlat 		= GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=memoryFlat&t=used&hostname='+$_GET['hostname'],'text');
		SwapTotalFlat 		= GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=memoryFlat&t=totSwap&hostname='+$_GET['hostname'],'text');
		SwapUsedFlat 		= GetData('http://testdb1.odobo.local/tool/manitou.src.php?src=memoryFlat&t=usedSwap&hostname='+$_GET['hostname'],'text');

		$.plot("#monthDisk", [
			/*
			{ 
				  data: SwapTotalFlat
				, label: "SWAP in MB"
				, color: 234 
				, lines: { show: false, fill: true}
				, yaxis: 1 
			}
			,
			{ 
				  data: SwapUsedFlat
				, label: "SWAP in MB"
				, color: 204 
				, lines: { show: false, fill: true}
				, yaxis: 1 
			}
			,
			*/
			{
				  data: MemoryUsedFlat
				, label: "RAM used"
				, color: 'brown' 
				, lines: { show: true, fill: false}
				, yaxis: 1 
			}
			,
			/*
			{
				  data: MemoryTotalFlat
				, label: "RAM"
				, color: 'red' 
				, lines: { show: false, fill: true}
				, yaxis: 1 
			}
			,
			*/
			{ 
				  data: hddFlatUsed_data 
				, label: "HDD used space on / in GB"
				, yaxis: 2 
				, color: '#FF6600' 
				, lines: { show: true, fill: true}
			}
			,
			{ 
				data: hddFlatTotal_data
				, label: "HDD total space on / in GB"
				, lines: { show: true, fill: true}
				, yaxis: 2 
			}
		], {
			xaxes: [ { mode: "time" },{
				
			} ],
			yaxes: [ 
				{ 
					  min: 0 
					, max: MemoryTotalFlat[0][1]
					, tickFormatter: MbFormatter
					, font:   
						{
						 size: 10
						 , style: "italic"
						 , color: 'brown' 
						 , weight: "bold"
						 //family: "sans-serif",
						// variant: "small-caps"
					   }
				}
				, {
					  max: hddFlatTotal_data[0][1]
					, alignTicksWithAxis: position == "right" ? 1 : null
					, position: position
					, tickFormatter: GbFormatter
					, font:   
						{
						 //size: 11
						 //, style: "italic"
						 //, color: '#FF6600' 
						 //, weight: "bold"
						 //, family: "sans-serif"
						// variant: "small-caps"
					   }
				} 
			],
			legend: 
			{ 
				position: "sw" 
				, show: false

			}
		});
		
		$("#monthDisk").draggable();
		$("#monthDisk").css("opacity", "0.3");
		//$("#monthDisk").css("background-image", "url(i/bggc.gif)");
		
		//setTimeout(function(){$("#monthDisk").css("background-image", "");$("#monthDisk").css("opacity", "1.0");}, 400);
		setTimeout(function(){$("#monthDisk").css("opacity", "0.4");}, 100);
		setTimeout(function(){$("#monthDisk").css("opacity", "0.5");}, 200);
		setTimeout(function(){$("#monthDisk").css("opacity", "0.6");}, 300);
		setTimeout(function(){$("#monthDisk").css("opacity", "0.7");}, 400);
		setTimeout(function(){$("#monthDisk").css("opacity", "0.8");}, 500);
		setTimeout(function(){$("#monthDisk").css("opacity", "0.9");}, 600);
		setTimeout(function(){$("#monthDisk").css("opacity", "1.0");}, 700);
	}

	function RepeatHdd() {
		hddFlat("right");
		setTimeout(RepeatHdd, 55000);
	}
	RepeatHdd() ;
	//function coloraxis (series) {console.log(series);return series.color; }
	

	function DataTable(typo,ts) {
		urlis = 'http://testdb1.odobo.local/tool/manitou.src.php?src='+typo+'&ts='+ts+'&hostname='+$_GET['hostname']+'&sess_back='+$_GET['sess_back'];
		console.log(urlis);
		$.ajax
		({
			async: false,
			url: urlis ,
			type: "GET",
			dataType: "text",
			success: 
				function (series){
					TableData = eval(series),	totalPoints = 30;
				}
		});

	}
	
	
})

	var DotValues;
	var FileList;
	var FileContent;

function makeTableHTML(myArray,color,mTime) {
	if (myArray.length > 7) {
		tdisplay='none';
		prep = '';
		} else {
		tdisplay='';
		prep = '';
	}
	var result = '<table border=0 style="display:'+tdisplay+'" id="Blya" class="DetailsTable">' + prep;
	for(var i=0; i<myArray.length; i++) {
		result += "<tr>";
		result += '<td style="font-size:11px;border-bottom: 1px #FF6600 solid;color:black;">'+ (i+1) +"</td>";
		for(var j=0; j<myArray[i].length; j++){
			result += "<td style=\"font-size:11px;border-bottom: 1px #FF6600 solid;color:"+color+";\">"+myArray[i][j]+"</td>";
			//lastind=j;
		}
		result += "</tr>";
	}
	result += "</table>";
	
	DotValues = result;
	return null;	
}

function ShowHide(me) {
	if (me.style.display=='none') {
		me.style.display='';
		} else {
		me.style.display='none';
	}
	return null;
}

var datar = new String;

function ExternalDataTable(url) {
	urlis = url;
	console.log(urlis);
	$.ajax
	({
		async: false,
		url: urlis ,
		type: "GET",
		dataType: "json",
		success: 
			function (series){
				datar = series;
			}
	});
	
	return datar;

}

function TemporarymakeTableHTML(myJson,color) {

	myArray=myJson.data;
	var keys = [], i = 0;    
	for( keys[ i++ ] in myArray[0] );
	//console.log(keys);

	var result = "<table border=0 class=\"DetailsTable\" >";
	for(var i=0; i<myArray.length; i++) {
		//console.log(i);
		result += "<tr>";
		result += "<td>"+ (i+1) +"</td>";
		for(j=0; j<keys.length; j++){
			var val = myArray[i][keys[j]];
			if (val.length > 49) {
				val=val.substring(0,29);
				val='<div id="full_val'+i+'" style="display:none;">' + myArray[i][keys[j]].replace(String.fromCharCode(13),'<br>') + '</div><u onclick="getElementById(\'FileContent\').innerHTML = getElementById(\'full_val'+i+'\').innerHTML;">' + myArray[i][keys[j-1]] + '</u>';
			}
			
			result += "<td style=\"font-size:11px;border-bottom: 1px #FF6600 solid;color:"+color+";\"><div title=\""+keys[j]+"\">"+val+"</div></td>";
			lastind=j;
		}
		result += "</tr>";
	}
	result += "</table>";

	return result;
}


  $(function() {
    $( "#TestDivWithLinks" ).draggable();
    $( "#DotValues" ).draggable();
    $( "#FileList" ).draggable();
    $( "#FileContent" ).draggable();
  });
/*

*/

/*

	Eto jesli ja vdrug vzdumaju sdelat clikalnymi chasy i dni - tipo pokazh za 25oje chislo ili tam za 12 chas...
	
		$("#setSelection").click(function () {
			plot.setSelection({
				xaxis: {
					from: 1397119163430,
					to: 1397119183430
				}
			});
		});
*/















