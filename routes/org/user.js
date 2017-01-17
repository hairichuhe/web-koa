var router = require('koa-router')();

router.get('/', async function (ctx, next) {

  await ctx.render('org/user/user', {
  });
})
module.exports = router;