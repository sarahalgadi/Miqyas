const bcrypt = require('bcrypt');
const username = require('../model/user'); //recheck with db  
// const loginForm = document.getElementById("loginForm");

//render loginForm
const getLogin =(req,res)=> {
    res.render('login');
};


//listener for LoginForm submission
const loginForm = async (req, res) => {
    //to prevent from default form submission
    Event.preventDefault();
    //retrieve role, username, and password
    const type = document.getElementById('type').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    //catch errors 
    try {
        const user = await user.findOne({ user: user });
        //username error 
        if (!user) {
            return res.send('<script> alert("User not found."); window.location.href="/login";</script>');
        }
        //password error 
        const isMatch = await bcrypt.compare(password, user.password); //not sure because auth. must be done from PSU's server right? 
        if (!isMatch) {
            return res.send('<script> alert("Wrong password"); window.location.href="/login";</script>');
        }
        //sucessful login: create session 
        req.session.user = user;
        //redirect to chosen role NEEDS TESTING!!!!!!  **Note: shall i keep the redirection here or in the view? 
        if (type == 'QA'){
            window.location.href='/qaHome'; 
        } else 
        if (type == 'CC'){
            window.location.href='ccHome';
        }else 
        if(type =='CP'){ 
            window.location.href = "/cpHome";
        }else 
        if (type == 'DCC' ){ 
            window.location.href = "/dccHome";
        } else 
                window.location.href = "/ciHome";
    } catch(error){
        console.error(error);
        return res.send('<script> alert("Unexpected error, please try again later."); window.location.href="/login";</script>');
    }
}; 

//Logout Listener 
const logout = (req, res) => {
    req.session.destroy((error)=>{
        if(error) throw error;
        res.redirect("/error");
    })
};

//exporting modules
module.exports = {
    getLogin: getLogin, 
    loginForm: loginForm,
    logout: logout   
};
