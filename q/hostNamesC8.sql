select distinct hostname id,hostname,valid::text as valid 
from conf.hosts 
where valid 
and cloud=3
order by hostname
;