select distinct hostname id,hostname,valid::text as valid,cloud
from conf.hosts 
order by hostname;