select 
	i,t,url,ip,headers->'user-agent' "user-agent" 
from  h_views 
order by t desc 
limit 9
;