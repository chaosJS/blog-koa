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

---

### nodejs 事件循环

1. `timer` >执行 setTimeout 和 setInterval 的回调
2. `IO callback` 执行 timer， check(setImmediate) ，close callbacks，之外的回调
3. idle
4. `poll` 检索新的 IO 事件，在恰当的时候 node 会阻塞在这个阶段
5. `check` setImmediate
6. close callbacks

- 进入 poll 阶段，未设定 timer
  - poll 回调队列不为空，同步执行队列里的回调函数，直到队列为空
  - poll 回调队列为空
    - 设定了 setImmediate ，结束 poll 阶段，进入 check(setImmediate)阶段，执行 check 阶段的回调队列，也就是 setImmediate 的回调函数
    - 没有设定 setImmediate ，将阻塞在这个 poll 阶段，等待回调函数加入 poll 的回调队列，一旦有回调进来就立即执行
- 进入 poll 阶段，设定了 timer
  - poll 回调队列为空， 将不断检查 timer 的时间，时间到了就执行对应的回调函数 然后开启新一轮事件循环执行 timer 回调队列的回调函数
