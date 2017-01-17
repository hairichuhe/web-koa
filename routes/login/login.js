var router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: '登录'
  };

  await ctx.render('login/login', {
  });
})
module.exports = router;