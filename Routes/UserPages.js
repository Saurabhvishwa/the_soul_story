const Router = require('express').Router();
const { ensureAuthenticated } = require('../config/auth');
const Authentication = require('../config/auth');

// schema
const Thought=  require('../Schema/Thought');

// Routes

Router.get('/home',Authentication.ensureAuthenticated, (req, res)=>{
    res.render('home', {'user':req.user});
})

Router.get('/dashboard', Authentication.ensureAuthenticated, (req, res) => {
    res.render('dashboard', {'user':req.user});
})

Router.get('/dashboard/new', Authentication.ensureAuthenticated, (req, res) => {
    res.render('New', {'user':req.user});
})

Router.post('/dashboard/new', Authentication.ensureAuthenticated, (req, res) => {
    let thought = new Thought({
        handle:req.user._id,
        body:req.body.body,
        title:req.body.title
    });
    thought.save((error, doc) => {
        if(error){
            console.log(error);
        }else{
            req.flash('success_msg',"Successfully added");
            res.redirect('/dashboard/new');
        }
    })
})

Router.get('/dashboard/show', Authentication.ensureAuthenticated, (req, res) => {
    Thought.find({handle:req.user._id}, (error, result) => {
        if(error){
            console.log(error);
        }else{
            res.render('Show', {'user':req.user, data:result});
        }
    })
    // res.render('Show', {'user':req.user,data:"Something"});
})

Router.get('/dashboard/show/:id', Authentication.ensureAuthenticated, (req, res) => {
    Thought.findById(req.params.id, (error, result) => {
        if(error){
            console.log(error);
        }else{
            res.render('Thought', {'user':req.user, data:result});
        }
    })
})

Router.get('/thought/edit/:id', Authentication.ensureAuthenticated, (req, res) => {
    Thought.findById(req.params.id, (error, result) => {
        if(error){
            console.log(error);
        }else{
            console.log(result);
            res.render('Edit', {'user':req.user, 'data':result});
        }
    })
})

Router.post('/thought/update/:id', Authentication.ensureAuthenticated, (req, res) => {
    Thought.updateOne({_id:req.params.id},{$set:{body:req.body.body}}, (error, result) => {
        if(error){
            console.log(error);
        }else{
            req.flash('success_msg','Successfully updated');
            res.redirect(`/dashboard/show/${req.params.id}`);
        }
    })
})

Router.get('/thought/delete/:id', ensureAuthenticated, (req, res) => {
    Thought.deleteOne({_id:req.params.id}, (error, result) => {
        if(error){
            console.log(error);
        }else{
            req.flash('success_msg',"Successfully deleted");
            res.redirect('/dashboard/show');
        }
    })
})
module.exports = Router;