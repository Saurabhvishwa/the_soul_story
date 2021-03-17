const mongoose = require("mongoose");
require('dotenv').config();
let db;
module.exports = {
    connect(callback){
        mongoose.connect(process.env.URL, { useUnifiedTopology: true, useNewUrlParser: true });
        const connection = mongoose.connection;
        return callback(connection);
    },
    getDB(){
        return db;
    }
}