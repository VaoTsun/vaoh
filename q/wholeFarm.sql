select 
    services.id services_id
  , services.sname "service:utf"
  , service_types.sname services_type
  , hosts.hostname
  , hosts.valid hosts_valid
  , services.valid service_valid
  , service_notes.notes "notes:wrp"
  , string_agg(tags.tag||':'||tags.val,', ') over (partition by services.id) tags 
  , provider.pname
  , vers_checks.val ver_check
from conf.hosts
join conf.services on services.hostname = hosts.hostname
left outer join conf.service_notes on serv_id = services.id
join conf.service_types on stype = service_types.id
left outer join conf.tags on tags.id = services.tag
join conf.provider on sprovider = provider.id
left outer join conf.vers_checks on vers_checks.sid = services.id
