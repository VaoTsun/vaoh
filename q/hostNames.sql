select distinct hostname id,hostname,valid::text as valid from conf.hosts order by hostname;--conf.hosts_tagged