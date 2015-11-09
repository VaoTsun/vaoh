truncate table conf.states; 
do
$do$
declare
  _hostname text := $host$__hostname__$host$;
  _rc bigint;
  _loc_drpdwn bigint := __loc_drpdwn__;
  _valid int := __tf_drpdwn__;
  _dbg text :='';
begin
    update conf.hosts set cloud = _loc_drpdwn, valid = _valid::boolean where hostname = _hostname;
    GET DIAGNOSTICS _rc = ROW_COUNT;
    _dbg := coalesce(_rc,0)||' rows affected';
    insert into conf.states (ts,str) select now(),_dbg;
    exception when OTHERS then _dbg:=_dbg||'ERROR: '||SQLERRM;
    raise info '%',''||SQLERRM;
  insert into conf.states (ts,str) select now(),_dbg;
end;
$do$
;
select * from conf.states;
