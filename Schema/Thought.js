const mongoose = require('mongoose');

const Thought = new mongoose.Schema({
    timestamp:{
        type:Date,
        default:new Date(),
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true,
    },
    handle:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("Thought", Thought);