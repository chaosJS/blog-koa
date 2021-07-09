const http = require('http');

const composeMiddleware = (middlewareList) => {
	// 核心next方法
	return (ctx) => {
		const dispatch = (i) => {
			const fn = middlewareList[i];
			try {
				return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
			} catch (error) {
				return Promise.reject(error);
			}
		};
		return dispatch(0);
	};
};

class MyKoa {
	constructor() {
		// store all the middleware
		this.middlewareList = [];
	}

	// app.use(async ()=>{})
	use(fn) {
		this.middlewareList.push(fn);
		// to chain call the use. not recommend
		// like app.use(async ()=>{}).use()....
		// return this;
	}
	// bind req and res to ctx
	createContext(req, res) {
		// in fact there are a lot of proxy in cxt
		const ctx = {
			req,
			res,
		};
		return ctx;
	}

	callback() {
		const middleware = composeMiddleware(this.middlewareList);
		return (req, res) => {
			const ctx = this.createContext(req, res);
			return middleware(ctx);
		};
	}
	listen(...args) {
		// pass all the args
		// like myExpress
		/**
		 * http.createServer((req,res)=>{})
		 */
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}
module.exports = MyKoa;
