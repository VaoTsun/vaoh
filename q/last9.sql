select 
	i::bigint,t at time zone 'utc',url,ip,headers->'user-agent' "user-agent", random()::float "fl" ,f.*
from  h_views 
left outer join (select generate_series(1,1999)/*,generate_series('2014-01-01','2015-01-01','1 day'::interval)*/,clock_timestamp(),800*random()::float) f on true
order by t desc 
limit 1999
;