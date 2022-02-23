//API to Get upcoming events

const pg = require('pg')
const pool = new pg.Pool({
   user: process.env.user,
host: process.env.host,
database: process.env.database,
password: process.env.password,
port: process.env.port,
});


async function query (event) {
  const client = await pool.connect(); 
  let res, statement; 
  let obj = {};
  obj.sData = {};
  const client = await pool.connect();
  
  try {
    try {
      res = await client.query(statement = `SELECT * from ${schema}.events`;);
       obj.sData = res.rows;
    } catch (err) {
      throw err;
    }
  } finally {
    client.release();
  }
  return obj;
}

exports.handler = async (event, context, callback) => {
   schema = event.schema;  
  var response ={};
  let upcoming = [];
  let cd = new Date();
  cd.setHours(0);
  cd.setMinutes(1);
  cd = cd.getTime();
  
    try {
      const rows = await query(event);
      
      for (let l=0;l<rows.sData.length;l++) {
        let sd = rows.sData[l].event_end_time;
        if (sd > cd) {
           upcoming.push(rows.sData[l]);
          }
       } 
        response.upcoming = upcoming;
        response.statusCode = 200;
        context.succeed(response);
    } catch (err) {
      response = {
          "statusCode": 400,
           "msg":err
      };
      context.succeed('Database ' + err);
    }
};
