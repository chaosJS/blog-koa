const exec = require('../db/mysql');
// const { genPassword } = require('../utils');
const userLogin = async (username, password) => {
	// no sql inject
	// username = escape(username)
	// 密码加密
	// password = genPassword(password);
	const sql = `select username, realname from users where username='${username}' and password = '${password}'`;
	const rows = await exec(sql);
	return rows[0] || {};
	// return exec(sql).then((rows) => {
	// 	// not found return a [] so we need to return a {}
	// 	return rows[0] || {};
	// });
};

module.exports = { userLogin };
