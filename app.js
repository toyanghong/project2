const Koa = require('koa');
const app = new Koa();

const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname));

console.log(path.join(__dirname));
app.use(main);

app.listen(3000);
console.log('app started at port 3000...');
 
//tijiao3333谔谔谔谔gai yixia 
