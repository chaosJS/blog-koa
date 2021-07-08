const Koa = require('koa');
const app = new Koa();
const path = require('path');
const fs = require('fs');
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
// const logger = require('koa-logger');
const logger = require('koa-morgan');

// session & redis
const session = require('koa-generic-session');
const redisStore = require('koa-redis');
const index = require('./routes/index');
const users = require('./routes/users');
const blog = require('./routes/blog');
// error handler
onerror(app);
// setting session redis
app.keys = ['random-keys'];
app.use(
	session({
		cookie: {
			path: '/',
			httpOnly: true,
			// 2min cookie expire
			maxAge: 120 * 1000,
		},
		// conf redis store
		store: redisStore({
			// depend on prod or dev env
			all: '127.0.0.1:6379',
		}),
	})
);

// middlewares
app.use(
	bodyparser({
		enableTypes: ['json', 'form', 'text'],
	})
);
app.use(json());
const logFileName = path.join(__dirname, 'logs', 'access.log');
const ws = fs.createWriteStream(logFileName, {
	// a means append
	flags: 'a',
});
app.use(
	logger('combined', {
		stream: ws,
	})
);
app.use(require('koa-static')(__dirname + '/public'));

app.use(
	views(__dirname + '/views', {
		extension: 'pug',
	})
);

// logger
app.use(async (ctx, next) => {
	const start = new Date();
	await next();
	const ms = new Date() - start;
	console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
app.use(blog.routes(), blog.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
	console.error('server error', err, ctx);
});

module.exports = app;
