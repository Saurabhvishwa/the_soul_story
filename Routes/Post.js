const Router = require('express').Router();
const AuthenticateToken = require('../Authenticate');

// Post Schema
const Post = require('../Schema/Thought');


// Routes
Router.get("/getAllPosts", (req, res)=>{
    Post.find({},(error, result) => {
        if(error){
            res.sendStatus(500);
        }else{
            res.status(200).json(result);
        }
    })
})
Router.post('/addNewPost', AuthenticateToken, (req,res) => {
    if(req.body.body.trim() === ""){
        res.status(400).json({error:"Empty Body"});
    }
    console.log(req.body)
    var post = new Post({
        body:req.body.body,
        handle:req.user,
    });
    post.save((error, doc) => {
        if(error){
            res.sendStatus(500);
        }else{
            res.sendStatus(201);
        }
    })
})

Router.delete("/deletePost/:postid", (req, res) => {
    Post.deleteOne({_id:req.params.postid}, (error, result) => {
        if(error){
            res.sendStatus(400);
        }else{
           if(result.deletedCount>0){
            res.sendStatus(202);
           }else{
               res.sendStatus(404);
           }
        }
    })
})

module.exports = Router;