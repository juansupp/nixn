'use strict';

import sql from 'mssql';
import Promise from 'promise';
// Get list of connections

export default class ructor {

  constructor() {

  }
  con(sentence, open) {

    let config = {
      user: 'sa',
      password: 'A*96NIXZ1996', // JS EN CASA
      //server : "186.29.68.122",
      //server: "localhost\\SQLEXPRESS", // You can use 'localhost\\instance' to connect to named instance
      database: 'mastodonp', // MASTODONX = PRODUCTION
      server : "170.117.20.208",
    };
/*"username": "sa",
"password": "sa@123",
"database": "test",
"host": "localhost",
"dialect": "mssql",
"port": 1433,
"dialectOptions": {
"instanceName": "SQLEXPRESS"
}*/
    return new Promise(function(resolve, reject) {
      let connection = new sql.Connection(config, err => {
        console.dir("error : "  + err)

        //if (err) return err;
        let request = new sql.Request(connection);
        request.query(sentence, (_err, recordset) => {
          console.log(_err)
          connection.close();
          if (open)
            err ? reject({err: err}) : resolve({recordset: recordset});
          else
            err ? reject(err) : resolve(err);
        });


      });
    });
  }

  all() {
    let sentence = 'select * from ' + entity;
    console.log(sentence);
    return this.con(sentence, true);
  }

  findBy(entity, where, val) {
    let sentence = "  select " + val + " from  " + entity + " where " + where;
    console.dir(sentence);
    return this.con(sentence, true);
  }

  paginate (entity,where,val,page,numPerPage) {
    //select count(id_ticket)  from ticket
    //select * from ticket order by id_ticket offset 0 rows fetch next 10 Rows Only
    let
      total = (page * numPerPage),
      sentence =
          `select ${val} from ${entity} where ${where}
          order by id_${entity} desc offset ${total} rows fetch next ${numPerPage} Rows Only`;
    console.log(sentence);
    return this.con(sentence,true);
  }

  insert(entity, val,custom='') {
    let
      sentence = `declare @t table (id_${entity} int) insert into ${entity} ${custom} Output inserted.id_${entity}  into @t values (${val}) select * from @t `
      //"insert into " + entity + " Output inserted.id_"+ entity +" values (" + val + ")"
    console.dir(sentence);
    return this.con(sentence, true);
  }

  update(entity, val,where) {
    let sentence = 'update ' + entity +' set ' + val + ' where ' + where;
    //console.dir(sentence);
    return this.con(sentence, false);
  }

  delete(entity,where) {
    let sentence = 'delete ' + entity +' where ' + where;
    console.dir(sentence);
    return this.con(sentence, false);
  }

}
