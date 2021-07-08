const { SuccessModel, ErrorModel } = require('../model/resModel');
module.exports = async (ctx, next) => {
	if (ctx.session.username) {
		await next();
	} else {
		ctx.body = new ErrorModel('not login');
	}
};
