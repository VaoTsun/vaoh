select distinct hostname id,hostname,valid::text as valid 
from conf.hosts 
where valid 
and cloud=1
order by hostname
;