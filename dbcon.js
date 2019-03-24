var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_yourONID',
  password        : '****',
  database        : 'cs340_yourONID'
});
module.exports.pool = pool;
