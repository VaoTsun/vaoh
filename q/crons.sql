select 
    schedules.added_uid, schedules.added_ts, schedules.comments schedules_comments
  , pgp_sym_decrypt(jobs.cmd,'__theKey__'::text),pgp_sym_decrypt(jobs.calendar,'__theKey__'::text),jobs.comments jobs_comments
  , clients.ts_added
  , schedules.sid
  , jobs.jid
  , clients.cid
  , admins.uid
from crons.schedules
join crons.jobs on schedules.jid = jobs.jid
join crons.clients on schedules.cid = clients.cid
join crons.admins on added_uid = admins.uid
where true
  and pgp_sym_decrypt(hostname,'__theKey__'::text) = '__theHost__'
  and pgp_sym_decrypt(os_user,'__theKey__'::text) = '__theUser__'
;
/*
firstKey
finrep00.odobo.prod
vladimirsvedov
*/