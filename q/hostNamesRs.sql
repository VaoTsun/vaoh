select distinct hostname id,hostname,valid::text as valid 
from conf.hosts 
where valid 
and cloud=2
order by hostname
;