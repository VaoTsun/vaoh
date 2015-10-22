//cloud load
initStats({
	  "id" : 'cloud_avgLoad'
	, "url" : 'http://db01.odobo.prod:7777/os'
	, "interval" : 10
	, "app" : {
		"path":".load[2]"
		, "etalon": 1.8
		, "differs": false
		, "alertLevel": 0
		, "where": "grid_cell_2x1"
		, "prepare": function (p) {
			if (p) {
				this.val = p.toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"load.png"}
});
//c8.vurtuefusion
initStats({
	  "id" : 'c8.vurtuefusion'
	, "url" : 'http://db-arch00.c8.prod/db?q=total'
	, "interval" : 12
	, "initValue" : 0
	, "app" : {
		"path":".rows[0]"
		//,"compareFunc":"hNumber(parseInt(d.n_tup_ins) - parseInt(v.wa[id].lastAnalyze)).coma + ' new rows...'"
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseInt(p.n_tup_ins);
			}
		}
	}
	, "attr" : {"icon":"book.png"}
});
//LatestGameRounds
initStats({
	  "id" : 'LatestGameRounds'
	, "url" : 'http://tools00.odobo.prod:5999/api-1.1/?rpName=LatestGameRounds&minutesBack=1&fromCache=30'
	, "interval" : 15
	, "app" : {
		"path":"[0]"
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = humanDate(p.gr_timestamp_updated);
			}
		}
	}
	, "goodColor" : "brown"
	, "attr" : {"icon":"data.png"}
});
// mongo - heartbeat
initStats({
	  "id" : 'mongo heartbeat'
	, "url" : 'https://vaoh.herokuapp.com/timestamp'
	, "interval" : 4
	, "app" : {
		"path":""
		,"compareFiled":"ts"
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = p.ts
			}
		}
	}
	, "goodColor" : "orange"
	, "attr" : {"icon":"clock.png"}
});
//odobo_cloud.locks
initStats({
	  "id" : 'odobo_cloud.locks'
	, "url" : 'http://db01.odobo.prod:7777/locks?db=odobo_cloud'
	, "interval" : 6
	, "app" : {
		  "path":".state"
		, "etalon": 5
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				var k = Object.keys(p);
				this.val = k.length;
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"lock.png"}
});
//c8_operator.locks
initStats({
	  "id" : 'c8_operator.locks'
	, "url" : 'http://db00.c8.prod:7777/locks?db=odobo_operator'
	, "interval" : 4
	, "app" : {
		  "path":".state"
		, "etalon": 2
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				var k = Object.keys(p);
				this.val = k.length;
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"lock.png"}
});
//c8 avgLoad
initStats({
	  "id" : 'c8 avgLoad'
	, "url" : 'http://db00.c8.prod:7777/os'
	, "interval" : 4
	, "app" : {
		"path":".load[2]"
		, "etalon": 1.8
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = p.toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"load.png"}
});

initStats({
	  "id" : 'c8 backup.free'
	, "url" : 'http://10.12.0.87:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[0].capacity"
		, "etalon": 0.86
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"hdd.png"}
});
initStats({
	  "id" : 'cloud backup.free'
	, "url" : 'http://172.16.0.25:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[7].capacity"
		, "etalon": 0.86
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"hdd.png"}
});
initStats({ "id" : 'cloud /pgbig'
	, "url" : 'http://db01.odobo.prod:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[2].capacity"
		, "etalon": 0.86
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"hdd.png"}
});
//cloud /pgfast
initStats({
	  "id" : 'cloud /pgfast'
	, "url" : 'http://db01.odobo.prod:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[5].capacity"
		, "etalon": 0.86
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"hdd.png"}
});
//cloud /pgarch
initStats({
	  "id" : 'cloud /pgarch'
	, "url" : 'http://db01.odobo.prod:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[4].capacity"
		, "etalon": 0.73
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"hdd.png"}
});
//AWS central backup
initStats({
	  "id" : 'AWS-S3 /pgbackup'
	, "url" : 'http://54.171.84.184:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[7].capacity"
		, "etalon": 0.73
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"hdd.png"}
});
//RDS command center
initStats({
	  "id" : 'RDS Command Centre'
	, "url" : 'http://52.18.154.16:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".memFree"
		, "etalon": 1
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val < this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"clock.png"}
});
// https://eu-west-1.console.aws.amazon.com/ec2/v2/home?region=eu-west-1#Instances:search=db-restore.odobo.ws;sort=Name
initStats({
	  "id" : 'Restore Free Space'
	, "url" : 'http://52.19.112.3:7777/os'
	, "interval" : 60
	, "app" : {
		"path":".hdd[7].capacity"
		, "etalon": 0.5
		, "differs": false
		, "alertLevel": 0
		, "prepare": function (p) {/* prepare value from JSON date got by ajax request */
			if (p) {
				this.val = parseFloat(p).toFixed(3);
			}
		}
		, "compare": function (p) {
			this.prepare(p);
			if (this.val != this.etalon) {
				this.differs = true;
				} else {
				this.differs = false;
			}
			if (this.val > this.etalon) {
				console.log(this.val,this.etalon);
				this.alertLevel = Math.abs(this.etalon-this.val);
				} else {
				this.alertLevel = 0;
			}
		}
	}
	, "attr" : {"icon":"clock.png"}
});
