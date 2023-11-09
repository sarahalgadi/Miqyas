const isAuth = (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      req.session.error = "You have to Login first";
      //this will be edited to redirect to the login page; reema's work so edit later
      res.redirect("/");
    }
  };
  
  module.exports={
    isAuth: isAuth
  };