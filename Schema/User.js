const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    _id:{
        type:String,
        auto:true,
        required:true,
    }
    ,
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{  
        type:String,
        required:true
    },
    location:{
        type:String
    },
    timestamp:{
        type:Date,
        default:new Date()
    },
    salt:{
        type:String,
        required:true,
        unique:true
    }
})
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);