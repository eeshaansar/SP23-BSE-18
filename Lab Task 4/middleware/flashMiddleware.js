const flashMiddleware = (app) => {
    const flash = require('connect-flash'); 
  
    app.use(flash());
  
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      next();
    });
  };
  
  module.exports = flashMiddleware;
  