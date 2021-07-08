const mysql = require('mysql');
const { MYSOL_CONF } = require('../conf/db');

const con = mysql.createConnection(MYSOL_CONF);

con.connect((err) => {
	if (err) {
		console.log(err, 'connect to mysql err');
	}
});

const exec = (sql) => {
	return new Promise((reslove, reject) => {
		con.query(sql, (err, res) => {
			if (err) {
				console.log(err, 'exec sql err');
				reject(err);
				return;
			}
			reslove(res);
		});
	});
};
// conn.end()
module.exports = exec;
