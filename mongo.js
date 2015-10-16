use admin
db.createUser(
  {
    user: "admin",
    pwd: "lol",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)

db.createRole(
   {
     role: "myClusterwideAdmin",
     privileges: [
       { resource: { cluster: true }, actions: [ "addShard" ] },
       { resource: { db: "config", collection: "" }, actions: [ "find", "update", "insert", "remove" ] },
       { resource: { db: "users", collection: "usersCollection" }, actions: [ "update", "insert", "remove" ] },
       { resource: { db: "", collection: "" }, actions: [ "find" ] }
     ],
     roles: [
       { role: "read", db: "admin" }
     ]
   },
   { w: "majority" , wtimeout: 5000 }
)


db.updateUser( "admin",
  {
    roles: 
    [ 
        { role: "userAdminAnyDatabase", db: "admin" }
      , { role : "readWrite", db : "admin"  } 
      , { role : "myClusterwideAdmin", db : "admin"  } 
      , { role : "root", db : "admin"  } 
      ]
  }
)


db.grantPrivilegesToRole(
  "myClusterwideAdmin",
  [
    {
      resource: { db: "admin", collection: "" },
      actions: [ "insert" ]
    },
    {
      resource: { db: "admin", collection: "system.js" },
      actions: [ "find" ]
    },
    {
      resource: { db: "", collection: "" },
      actions: [ "find","hostInfo" ]
    }
  ],
  { w: "majority" }
)


use admin
db.createUser( {
    user: "siteUserAdmin",
    pwd: "kuni-puni",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  });
db.createUser( {
    user: "siteRootAdmin",
    pwd: "pani-mo",
    roles: [ { role: "root", db: "admin" } ]
  });