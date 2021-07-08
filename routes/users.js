const router = require('koa-router')();
const { userLogin } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');
router.prefix('/users');

router.get('/', async function (ctx, next) {
	if (ctx.session.username) {
		ctx.body(req.session);
	} else {
		ctx.body = `
    <form action="/users/login" method="post">
    <p>First name: <input type="text" name="username" /></p>
    <p>Last name: <input type="password" name="password" /></p>
    <input type="submit" value="Submit" />
  </form>
    `;
	}
});

router.post('/login', async function (ctx, next) {
	const { username, password } = ctx.request.body;
	const loginData = await userLogin(username, password);
	if (loginData.username) {
		// set session
		ctx.session.username = loginData.username;
		ctx.session.realname = loginData.realname;
		ctx.body = new SuccessModel(true, 'login success');
	} else {
		ctx.body = new ErrorModel('login fail');
	}
});
router.get('/login-test', function (ctx, next) {
	// after use session and redis, now we can use session in ctx.session
	console.log(ctx.session.viewCount);
	if (ctx.session.viewCount === null) {
		ctx.session.viewCount = 1;
	}
	ctx.session.viewCount++;
	ctx.body = {
		success: true,
		data: {
			...ctx.session,
		},
	};
});
module.exports = router;
