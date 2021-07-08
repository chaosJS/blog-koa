const router = require('koa-router')();
const { getBlogList, getBlogDetail } = require('../controller/blog');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
router.prefix('/api/blog');
router.get('/list', loginCheck, async function (ctx, next) {
	const { author, keyword } = ctx.query;
	const blogList = await getBlogList(author, keyword);
	ctx.body = new SuccessModel(blogList);
});

router.get('/detail', async function (ctx, next) {
	const { id } = ctx.query;
	if (id) {
		const blogDetail = await getBlogDetail(id);
		if (blogDetail) {
			ctx.body = new SuccessModel(blogDetail);
		} else {
			ctx.body = new ErrorModel('no blog detail');
		}
	} else {
		ctx.body = new ErrorModel('no blog detail id');
	}
});

module.exports = router;
