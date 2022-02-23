//API to list down events: Frontend developer should send schema name as yocket 

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
    statement =`Select * from ${schema}.events`;
  try {
    try {
      res = await client.query(statement);
        res = res.rows;
    // await client.query('COMMIT')
    } catch (err) {
    //  await client.query('ROLLBACK')
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
}

exports.handler = async (event, context, callback) => {
   schema = event.schema;  
  var response ={};
    try {
      const rows = await query(event);
      
      //console.log(JSON.stringify(rows[0]))
     response = {
          "statusCode": 200,
           "body":rows
      };
      
      context.succeed(response);
    } catch (err) {
      response = {
          "statusCode": 400,
           "msg":err
      };
      context.succeed('Database ' + err);
    }
};


//The response would list down all the events along with related data. This lambda should be connected with an API through AWS API Gateways.
