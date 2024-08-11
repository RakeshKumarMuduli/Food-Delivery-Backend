const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change this to your MySQL username
    password: 'Rakesh@424', // Change this to your MySQL password
    database: 'College', // Change this to your MySQL database name
    authPlugin: 'mysql_native_password'
  });

  db.connect((err) => {
   
    console.log('MySQL Connected...');
  });

module.exports = db;
