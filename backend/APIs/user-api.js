// //create author api app
// const exp=require('express');
// const userApp=exp.Router();
// const bcryptjs=require('bcryptjs')
// const expressAsyncHandler=require('express-async-handler')
// const jsonwebtoken=require('jsonwebtoken')
// require("dotenv").config

// const commonApp=require('./common-api');

// let userscollection;
// let articlescollection;
// // get usercollection app
// userApp.use((req,res,next)=>{
//     userscollection=req.app.get('userscollection')
//     articlescollection=req.app.get('articlescollection')
//     next()
// })

// userApp.post('/user' ,expressAsyncHandler(async(req,res)=>{
//     //get users resourse from client
//     const newUser=req.body;
//     //check for duplicate users based on username
//     const dbuser=await userscollection.findOne({username:newUser.username})
//     //if user found in db
//     if(dbuser!==null)
//     {
//         res.send({message:"user existed"})
//     }else{
//         //hash the password
//         const hashedpassword=await bcryptjs.hash(newUser.password,6)
//         // replace plane password with hashed password
//         newUser.password=hashedpassword;
//         //create user
//         await userscollection.insertOne(newUser)
//         // send response
//         res.send({message:"user created"})

//     }
// }))

// userApp.post('/login',expressAsyncHandler(async(req,res)=>{
//     //get login format
//     const userdetails=req.body
//     //check for username
//     const dbuser=await userscollection.findOne({username:userdetails.username})
//     if(dbuser===null)
//     {
//         res.send({message:"invalid username enter again"})
//     }else{
//         //check for password
//         const status= await bcryptjs.compare(userdetails.password,dbuser.password)
//         if(status===false)
//         {
//             res.send({message:"invalid password enter again"})
//         }else{
//             //create jwt token and encode it
//             const signedtoken=jsonwebtoken.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:20})
//             //send response
//             res.send({message:'login sucessful',token:signedtoken,user:dbuser})
//         }
//     }
// }))

// // get the articles of all users
// userApp.get('/articles',expressAsyncHandler(async(req,res)=>
// {
//     //get the aricles data from main route
//     const articlescollection =req.app.get('articlescollection')
//     //get all articles
//     let articleslist=await articlescollection.find().toArray();
//     //send the response to the user
//     res.send({message:"The articles are",payload:articleslist})
// }))

// // post comments to article by article id
// userApp.post('/comment/',expressAsyncHandler(async (req,res)=>{
//     // get user comment
//     const userComment=req.body;
//     // insert userComment into articles collection by article id
//     let result=await articlescollection.updateOne(
//         {articleId:userComment.article}
//     );


// }))
// userApp.use((err,req,res,next)=>{
//     res.send({message:'error message',payload: err.message})
// })
// module.exports=userApp;
//create user api app
const exp = require("express");
const userApp = exp.Router();
const bcryptjs = require("bcryptjs");
const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const verifyToken=require('../middlewares/verifyToken')
require("dotenv").config();

// userApp.use((req, res, next) => {
  //   userscollection = req.app.get("userscollection");
  //   articlescollection = req.app.get("articlescollection");
  //   next();
  // });
const dbobj=require('../server')

//user registration route
userApp.post("/new-user",expressAsyncHandler(async (req, res) => {
    //get user resource from client
    const newUser = req.body;
    //check for duplicate user based on username
    const dbuser = await dbobj.userscollection.findOne({ username: newUser.username });
    if (dbuser !== null) {
      res.send({ message: "User already existed" });
    } else {
      newUser.password = await bcryptjs.hash(newUser.password, 5);
      //create user
      await dbobj.userscollection.insertMany([newUser]);
      //send res
      res.send({ message: "User created" });
    }
  })
);

//user login
userApp.post("/login",expressAsyncHandler(async (req, res) => {
    //get usercred obj 
    const userCred = req.body;
    const dbuser = await dbobj.userscollection.findOne({
      username: userCred.username,
    });
    if (dbuser === null) {
      res.send({ message: "Invalid username" });
    } else {
      //check for password
      const status = await bcryptjs.compare(userCred.password, dbuser.password);
      if (status === false) {
        res.send({ message: "Invalid password" });
      } else {
        //create jwt token
        const signedToken = jwt.sign({ username: dbuser.username },process.env.SECRET_KEY,{ expiresIn: '1d' });
        //send res
        res.send({message:"login success",token:signedToken,user:dbuser,});
      }
    }
  })
);

//get articles of all authors
userApp.get("/articles",verifyToken,expressAsyncHandler(async (req, res) => {
    //get all articles
    let articlesList = await dbobj.articlescollection.find({ status: true });
    //send res
    res.send({ message: "articles", payload: articlesList });
  })
);1

//post comments for an arcicle by atricle id
userApp.post("/comment/:articleId",verifyToken,expressAsyncHandler(async (req, res) => {
    //get user comment obj
    const userComment = req.body;
    const articleIdu=Number(req.params.articleId);
    //insert userComment object to comments array of article by id
    await dbobj.articlescollection.updateOne({ articleId: articleIdu},{ $addToSet: { comments: userComment } }
    );
    let article=await dbobj.articlescollection.findOne({articleId:articleIdu})
    res.send({ message: "Comment posted" ,payload:article.comments});
  })
);

//export userApp
module.exports = userApp;