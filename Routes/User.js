const Router = require('express').Router();
const crypto = require('crypto');
require('dotenv').config();
const AuthenticateToken = require('../Authenticate');
const passport = require('passport');
const Authentication = require('../config/auth');
// Schema
const User = require('../Schema/User');

// hashing
let LoginPasswordHasher = (password,salt) => {
        let Hash = crypto.createHmac('sha256',`${salt}`);
        Hash.update(`${password}`);
        return Hash.digest('hex');
}

// field validation
let loginValidate = (data) => {
    var errors = [];
    if(data.email==="" || data.password===""){
        errors.push("Please fill all the fields");
    }
    return errors;
}
let registerValidate = (data) => {
    let errors = [];
    let res = {};
    if(data.username==="" || data.location===""){
        errors.push("Please fill all the fields");
    }
    if(data.email===""){
        errors.push("Please fill all the fields");
    }else{
                res.ID=crypto.createHmac('md5',`${data.email}`).digest('hex');
    }
    if(data.password==="" || data.confirmPassword===""){
        errors.push("Please fill all the fields");
    }
    else if(data.password.length<6){
        errors.push("Password should be at least 6 characters");
    }
    else if(data.confirmPassword !== data.password){
        errors.push("Passwords don't match");
    }else {
        res.salt = crypto.randomBytes(16).toString('hex');

        let Hash = crypto.createHmac('sha256',`${data.salt}`);
        Hash.update(`${data.password}`);
        res.hash = Hash.digest('hex');
    }
    return {
        errors:errors,
        result:res
    }
}

// Routes
Router.get('/', (req, res) => {
        res.redirect('/home');
})

Router.get('/login', Authentication.forwardAuthenticated , (req, res) => {
    res.render('login');
})

Router.get('/register', (req,res)=> {
    res.render('register');
})

Router.post("/login", (req, res, next) => {
    let errors = loginValidate(req.body);
    if(errors.length === 0){
        passport.authenticate('local',{
            successRedirect:'/home',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next);
    }else{
        res.render('login',{'errors':errors,email:req.body.email});
    }
})

Router.post("/register", (req,res) => {
    console.log(req.body)
    let d = registerValidate(req.body);
    if(d.errors.length === 0){
        var user = new User({
            _id:d.result.ID,
            username:req.body.username,
            email:req.body.email,
            password:d.result.hash,
            location:req.body.location,
            salt:d.result.salt
        });
        user.save((error, doc)=>{
            if(!error){
                req.flash('success_msg','You are now registered and can log in');
                res.redirect('/login');
            }else{
                console.log(error);
            }
        })
    }else{
        res.render('register',{'errors':d.errors,'username':req.body.username,'email':req.body.email,'location':req.body.location});
    }
    
})

Router.get("/update",Authentication.ensureAuthenticated, (req,res) => {
    res.render('update',{'user':req.user});
})

Router.post("/update",Authentication.ensureAuthenticated, (req, res) => {
    User.updateOne({'_id':req.user._id},{$set:{'location':req.body.location,'username':req.body.username}}, (err, result) => {
        if(err){
            console.log(err);
        }else{
            req.flash("success_msg","Successfully updated");
            res.redirect('/home');
        }
    })
})

Router.get("/delete",Authentication.ensureAuthenticated, (req, res) => {
    User.deleteOne({'_id':req.user._id}, () => {
        console.log("Working here.....")
            req.flash('success_msg','User successfully deleted');
            req.logout();
            res.redirect('/login');
    })
})
 Router.get("/user",Authentication.ensureAuthenticated, (req,res) =>{
     User.findById(req.session.passport.user, function(err, user){
        if(err){
            console.log(err);
        }else{
            res.status(200).json(user)
        }
    })
 })

 Router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
  });


module.exports = Router;