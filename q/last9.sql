select 
	f.*,i::bigint,t at time zone 'utc',url,ip,headers->'user-agent' "user-agent", random()::float "fl" 
from  h_views 
left outer join (select clock_timestamp()
	,800*random()::float rand
, substr(
  'Преобразует строку в кодировку СУБД. Исходная кодировка задаётся аргументом src_encoding. Заданная строка должна быть и исходной кодировке'
 , round(random()*90)::int
 , round(random()*90)::int
) "russ:utf"
,substr(
  e'See populate a database in the PostgreSQL manual, depesz excellent-as-usual article on the topic, and this SO question.'
 , round(random()*90)::int
 , round(random()*90)::int
) ascii
, row_number() over()
,generate_series('2014-01-01','2014-02-11','1 day'::interval) mnth
from generate_series(1,1999)
) f on true
limit 1999
;
/**/
