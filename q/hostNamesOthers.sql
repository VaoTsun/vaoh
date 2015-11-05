select distinct hostname id,hostname,valid::text as valid 
from conf.hosts 
where valid 
and (cloud not in (1,2,3) or cloud is null)
order by hostname
;