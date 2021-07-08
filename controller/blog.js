// 只关心数据的计算返回
const fs = require('fs');
const path = require('path');
const exec = require('../db/mysql');
const getBlogList = async (author = '', keyword = '') => {
	// why add 1=1
	// if author and keyword is null ,we get
	// select * from blogs where 1=1 order by createtime desc;
	// this sql can exec
	// without 1=1 we get
	// select * from blogs where order by createtime desc;
	// this is a wrong sql statement
	const sql = `select * from blogs where 1=1 ${
		author ? `and \`author\`='${author}'` : ''
	}${
		keyword ? `and \`title\` like '%${keyword}%'` : ''
	} order by createtime desc;`;
	return await exec(sql);
};
const getBlogDetail = async (id = '') => {
	const sql = `select * from blogs where 1=1 ${
		id ? `and \`id\`='${id}'` : ''
	} `;
	console.log(sql);
	const rows = await exec(sql);
	return rows[0];
	// return exec(sql).then((rows) => {
	// 	return rows[0];
	// });
};
const newBlog = async (blogData = {}) => {
	const {
		title,
		content,
		// 暂时
		author,
		createtime = Date.now(),
	} = blogData;
	const sql = `
		insert into blogs (title,content, author, createtime)
		values ('${title}','${content}','${author}',${createtime});
	`;
	console.log(sql);
	const insertData = await exec(sql);
	return {
		id: insertData.insertId,
	};
	// return exec(sql).then((insertData) => {
	// 	return {
	// 		id: insertData.insertId,
	// 	};
	// });
};
const updataBlog = async (blogId, blogdata = {}) => {
	const { title, content } = blogdata;

	const sql = `update blogs set title='${title}' , content = '${content}' where id = '${blogId}'`;
	const updateData = await exec(sql);
	return updateData.affectedRows > 0;
	// return exec(sql).then((updateData) => {
	// 	return updateData.affectedRows > 0;
	// });
};
const delBlog = async (blogId, author) => {
	const sql = `delete from  blogs   where id = '${blogId}' and author = '${author}'`;
	const delData = await exec(sql);
	return delData.affectedRows > 0;
	// return exec(sql).then((delData) => {
	// 	return delData.affectedRows > 0;
	// });
};
const getPromiseData = (fileName) => {
	return new Promise((res, rej) => {
		const fullPath = path.resolve(__dirname, './', fileName);
		fs.readFile(fullPath, (err, data) => {
			err && rej(err);
			res(JSON.parse(data.toString()));
		});
	});
};
module.exports = {
	getBlogList,
	getBlogDetail,
	getPromiseData,
	newBlog,
	updataBlog,
	delBlog,
};
