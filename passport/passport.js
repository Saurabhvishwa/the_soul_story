const crypto = require('crypto');
const localStrategy = require('passport-local').Strategy;

// imports
const UserSchema = require('../Schema/User');
const User = require('../Schema/User');

// hashing
let LoginPasswordHasher = (password,salt) => {
    let Hash = crypto.createHmac('sha256',`${salt}`);
    Hash.update(`${password}`);
    return Hash.digest('hex');
}

module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField:'email'}, (email, password, done) => {
            UserSchema.findOne({
                email:email
            }).then(user => {
                if(!user){
                    return done(null,false, {message:'Not registered'});
                }
                var hashPassword = LoginPasswordHasher(password, user.salt);
                if(hashPassword === user.password){
                    return done(null, user);
                }else{
                    return done(null, false, {message:'Password incorrect'});
                }
            })
        })
        );
        passport.serializeUser(function(user, done) {
            done(null,user.id);
        });
        passport.deserializeUser(function(id, done){
            User.findById(id, function(err, user){
                done(err,{
                    _id:user._id,
                    email:user.email,
                    location:user.location,
                    username:user.username
                });
            })
        })
}