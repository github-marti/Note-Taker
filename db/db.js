'user strict';

const mysql = require('mysql');

// local mysql db connection
let connection;

if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'asdfasdf',
        database : 'notes_DB'
    });
};

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = connection;