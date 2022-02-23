//API to Get Live event- it should only be live 10 mins before the start time of the

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
  obj.eventData = {};
  const client = await pool.connect();
  
  try {
    try {
      res = await client.query(statement = `SELECT * from ${schema}.events`;);
       obj.eventData = res.rows;
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
  let liveevents = [];
  let cd = new Date();
  cd.setHours(0);
  cd.setMinutes(1);
  cd = cd.getTime();
  
    try {
      const rows = await query(event);
      
      for (let l=0;l<rows.eventData.length;l++) {
        let sd = rows.eventData[l].event_start_time;
        let tenminless =  new Date( rows.eventData[l].event_start_time - (60 * 1000));
        
        if (cd === tenminless.getTime() && tenminless.getTime() <  rows.eventData[l].event_start_time){
           liveevents.push(rows.eventData[l]);
          }
       } 
        response.liveEvents = liveevents;
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


//This lambda should be connect with AWS API Gateway and that api can be shared with the front end developers
