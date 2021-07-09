1. copy blog project to koa
2. rewrite middleware principle
3. `await next()` 顺序

   1. 中止当前中间件执行，执行下一个中间件，直到最后一个中间件执行完
   2. 返回上一个中间件继续执行，直到第一个中间件执行完，所谓洋葱圈模型

      ```js
      app.use(async (ctx, next) => {
      	console.log('start');
      	await next();
      	console.log('111');
      	console.log(ctx.xxxx);
      });
      app.use(async (ctx, next) => {
      	await next();
      	console.log('2222');
      });
      app.use(async (ctx, next) => {
      	ctx.xxxx = 'my data';
      	await next();
      	console.log('3333');
      });
      app.use(async (ctx, next) => {
      	console.log('end');
      	ctx.body = 'end';
      });
      /** 
        start
        end
        3333
        2222
        111
        my data
      */
      ```

4. mini-koa `/test/my-koa.js`
   1. 实现 `await next()` 的关键在 composeMiddleware 函数
      ```js
      const composeMiddleware = (middlewareList) => {
      	// 核心next方法
      	return (ctx) => {
      		const dispatch = (i) => {
      			// 当前执行的middleware
      			const fn = middlewareList[i];
      			try {
      				// Promise.resolve 包一层 兼容 非异步写法
      				// 回调 调用dispatch一个个往下执行middleware
      				return Promise.resolve(fn(ctx, () => dispatch(i + 1)));
      			} catch (error) {
      				return Promise.reject(error);
      			}
      		};
      		return dispatch(0);
      	};
      };
      ```
   2. 测试用例 `node test-my-koa.js`
5. pm2 进程守护 进程奔溃会自动重启
   1. pm2 list
   2. pm2 start app.js/配置文件
   3. pm2 restart/stop/delete appName/id
6. pm2 配置文件 `pm2 config.json`
7. pm2 多进程 请求根据计算机进程空闲与否分配
   1. 提高 cpu/内存利用率
   2. 与 redis 配合 共享数据
