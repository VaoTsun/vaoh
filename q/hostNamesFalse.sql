select distinct hostname id,hostname,valid::text as valid 
from conf.hosts 
where not valid 
order by hostname
;