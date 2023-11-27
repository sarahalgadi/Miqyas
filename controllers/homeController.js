const userModel = require('../models/UserModel')

async function getUser(req,res ){
    
    const user= req.session.user;
    const term = await userModel.getCurrentTerm(user.username);
    const userRoles = await userModel.getUserRoles(user.username, term);
    const coordinatedCourses = await userModel.getCoordinatedCourses(user.username, term);
    
    console.log("username", user.username)
    console.log("term", term)
    const fullName = user.fullName;
    const title = "Miqyas: Home";
    const courses = await userModel.getCourses(user.username, term);

    console.log(courses);
    console.log("coordinated courses", coordinatedCourses);
    console.log("user roles", userRoles);
    
    console.log("lolgetuser", user)
    res.render('home', {user, title, fullName, term, courses, userRoles, coordinatedCourses});
}




  module.exports = {getUser};
  