truncate table conf.states; 
do
$do$
declare
  _hostname text := $host$__hostname__$host$;
  _rc bigint;
  _loc_drpdwn bigint := __loc_drpdwn__;
  _dbg text :='';
begin
    insert into conf.hosts (hostname,cloud) select _hostname,_loc_drpdwn;
    GET DIAGNOSTICS _rc = ROW_COUNT;
    _dbg := coalesce(_rc,0)||' rows affected';
    exception when OTHERS then _dbg:=_dbg||'ERROR: '||SQLERRM;
    raise info '%',''||SQLERRM;
  insert into conf.states (ts,str) select now(),_dbg;
end;
$do$
;
select * from conf.states;
/*
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
*/
/*
Platform
srv00.c8.fun
srv02.c8.prod
srv00.c8.stg
srv00.c8.nat
srv00.freeplay.odobo.prod
srv00.odobo.demo
srv00.odobo.prod
srv00.operator.odobo.demo
srv01.c8.fun
srv01.c8.nat
srv03.c8.prod
srv01.c8.stg
srv01.freeplay.odobo.prod
srv01.odobo.demo
srv01.odobo.prod
srv00.odobo.qa
srv00.odobo.stg
srv00.operator.odobo.stg
srv01.odobo.qa
srv02.odobo.qa
srv01.odobo.stg
prdops001.prd.betfair
cloud.community.prod
operator.community.prod
*/
