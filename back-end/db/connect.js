var mysql = require('mysql')
var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'akhilesh26', //change your password
  database : 'Udaan_Cinema'
});

module.exports = con;