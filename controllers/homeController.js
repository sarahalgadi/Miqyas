const userModel = require('../models/UserModel')

async function getUser(req,res ){
    
    const user= req.session.user;
    const term = await userModel.getCurrentTerm(user.username);
    console.log("termmmmmm", term)
    const fullName = user.fullName;
    const title = "Miqyas: Home";
    console.log("lolgetuser", user)
    res.render('home', {user, title, fullName, term});
}


  module.exports = {getUser};
  