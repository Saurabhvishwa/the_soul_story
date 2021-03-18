require("dotenv").config();
// Server App
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
require("./passport/passport")(passport);

// cors
app.use(cors());

// view engine
app.set("view engine", "ejs");

// MongoDB connection
const dbConnection = require("./Database/DB");

// express session
const expressSession = require("express-session")({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
});

// app use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(expressLayouts);
app.use(flash());

// public directory
app.use(express.static("public"));
app.use("/images", express.static(__dirname + "/Images"));
app.use("/css", express.static(__dirname + "/css"));

// Constants
const PORT = process.env.PORT;

// Database Connection Open
dbConnection.connect((connection) => {
  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
  });
});

// Route Imports
const User = require("./Routes/User");
const Post = require("./Routes/Post");
const UserPages = require("./Routes/UserPages");

// global varibles
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.errors = req.flash("error");
  next();
});

// Routes
app.use("/", User);
app.use("/", Post);
app.use("/", UserPages);

app.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`);
});
