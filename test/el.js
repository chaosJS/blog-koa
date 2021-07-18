const fs = require('fs');
const path = require('path');
// const asyncFn = (cb) => {
// 	// 假设花费2ms
// 	fs.readFile(path.resolve(__dirname, '/test.js'), cb);
// };
// let startTime = Date.now();
// let fileReadTime = 0;
// setTimeout(() => {
// 	let delay = Date.now() - startTime;
// 	console.log(`setTimeout: ${delay} ms have passed since i was called`);
// 	console.log(`fileReadTime: ${fileReadTime - startTime} `);
// }, 10);
// asyncFn(() => {
// 	fileReadTime = Date.now();
// 	while (Date.now() - fileReadTime < 20) {}
// });

setTimeout(() => {
	console.log('setTimeout outer');
}, 1);

setImmediate(() => {
	console.log('setImmediate outer');
});
// 假设花费2ms
fs.readFile(path.resolve(__dirname, '/test.js'), () => {
	setTimeout(() => {
		console.log('setTimeout');
	}, 1);

	setImmediate(() => {
		console.log('setImmediate');
	});
});
