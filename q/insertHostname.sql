do
$do$
declare
  _hostname text := $host$__hostname__$host$;
  _rc bigint;
  --_tid bigint := __tid__;
  _env_drpdwnH bigint := __env_drpdwnH__;
  _loc_drpdwnH bigint := __loc_drpdwnH__;
  _dbg text;
begin
  truncate table conf.states; 
  begin
    insert into conf.hosts (hostname) select _hostname;
    GET DIAGNOSTICS _rc = ROW_COUNT;
    _dbg := coalesce(_rc,0)||' rows affected';
    exception when OTHERS then _dbg:=_dbg||coalesce(SQLSTATE,' ');
  end;
  --insert into conf.tags (tag,val) select
  insert into conf.hosts_tagged (hostname,tid) select _hostname,_env_drpdwnH;
  insert into conf.hosts_tagged (hostname,tid) select _hostname,_loc_drpdwnH;
    GET DIAGNOSTICS _rc = ROW_COUNT;
    _dbg := _dbg||chr(10)||coalesce(_rc,0)||' rows affected';
  insert into conf.states (ts,str) select now(),_dbg;
end;
$do$
;
select * from conf.states;