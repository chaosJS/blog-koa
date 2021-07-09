const Mykoa = require('./my-koa');
const app = new Mykoa();
app.use(async (ctx, next) => {
	console.log('start--11');
	await next();
	const rt = ctx['X-Response-Time'];
	console.log(`${ctx.req.method} -- ${ctx.req.url} -- ${rt}`);
});

// X-Response-Time
app.use(async (ctx, next) => {
	console.log('222');
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx['X-Response-Time'] = `${ms}ms`;
	console.log('222---end');
});
app.use(async (ctx, next) => {
	ctx.res.end('hello test myKoa');
});
app.listen(9002, () => {
	console.log('test my koa in 9002');
});
