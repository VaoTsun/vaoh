truncate table conf.states; 
do
$do$
declare
  _hostname text := $host$__hostname__$host$;
  _rc bigint;
  _loc_drpdwn bigint := __n_loc_drpdwn__;
  _dbg text :='';
begin
    insert into conf.hosts (hostname,cloud) select _hostname,_loc_drpdwn;
    GET DIAGNOSTICS _rc = ROW_COUNT;
    _dbg := coalesce(_rc,0)||' rows affected'||chr(10)||' :: "'||_hostname||'" "'||__n_loc_drpdwn__||'"';
	insert into conf.states (ts,str) select now(),_dbg;
    exception when OTHERS then _dbg:=_dbg||'ERROR: '||SQLERRM;
      raise info '%',''||SQLERRM;
      insert into conf.states (ts,str) select now(),_dbg;
end;
$do$
;
select * from conf.states;
