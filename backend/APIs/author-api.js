// //create author api app
// const exp=require('express');
// const authorApp=exp.Router()
// const bcryptjs=require('bcryptjs')
// const expressAsyncHandler=require('express-async-handler')
// const jsonwebtoken=require('jsonwebtoken')
// require('dotenv').config
// const verifyToken=require('../middlewares/verifyToken')

// let authorcollection;
//  //get author collections from app
// authorApp.use((req,res,next)=>{
//     authorcollection=req.app.get('authorcollection')
//     articlescollection=req.app.get('articlescollection')
//     next()
// })
// // creating author
// authorApp.post('/author' ,expressAsyncHandler( async(req,res)=>{
//     //get author resourse from client
//     const newauthor=req.body;
//     //check for duplicate author based on username
//     const dbauthor=await authorcollection.findOne({username:newauthor.username})
//     if(dbauthor!==null)
//     {
//         res.send({message:"author existed"})
//     }
//     else{
//         //create the author registration
//         //hash the password
//         const hashedPassword=await bcryptjs.hash(newauthor.password,6)
//         //replace plain password with hashed password
//         newauthor.password=hashedPassword
//         //create author
//         await authorcollection.insertOne(newauthor)
//         //send response
//         res.send({message:"author registration sussesful"})
//     }    
// }))
// //author login
// authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
//     //get the ligin fromat from client
//     const authordetails=req.body
//     //checck for author detailes in database
//     const dbauthor=await authorcollection.findOne({username:authordetails.username})
//     if(dbauthor===null){
//         res.send({message:"invalid username enter again"})}
//     else{
//         //compare the password
//         const status=await bcryptjs.compare(authordetails.password,dbauthor.password)
//         if(status===false)
//         {
//             res.send({message:"invalid password enter again"})
//         }else{
//             //create jwt token
//             const signedtoken=jsonwebtoken.sign({username:dbauthor.username},process.env.SECRET_KEY,{expiresIn:20})
//             // send response
//             res.send({message:"login sucessfull",token:signedtoken,author:dbauthor})
//         }
//     }
// }))
// // adding articles by author
// authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
//     // get articles from client
//     const articlesdetails=req.body
//     // post to articles collection
//     await articlescollection.insertOne(articlesdetails)
//     // send response
//     res.send({message:"article entered sucessfully"})

// }))

// // modify the article
// authorApp.put('/article',verifyToken,expressAsyncHandler(async (req,res)=>{
//     // get modified article from client
//     const modifiedArticle=req.body;
//     // update the article by articcle id
//     let result = await articlescollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
//     // send response
//     res.send({message:"articel modified "})
// }))


// // delete an article 
// authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
//     //get article Id
//     const articleIdFromUrl=req.params.articleId;
//     //get article
//     const articleToDelete=req.body;
//     //update status of the article false
//     await articlescollection.updateOne({articleId:articleIdFromUrl},{$set:{...articleToDelete,status:false}})
//     res.send({message:"article deleted "})
// }))


// // read articles from server
// authorApp.get('/article/:username',expressAsyncHandler(async(req,res)=>{
// //get author userneme
// const authorName=req.params.username;
// //get articles whose status is true
// const articlesList=await articlescollection.find({status:true,username:authorName}).toArray()
// // send response
// res.send({message:"List of articles are",payload:articlesList})

// }))


// module.exports=authorApp;


//create author api app
const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const verifyToken=require('../middlewares/verifyToken')
require("dotenv").config();

// authorApp.use((req,res,next)=>{
//     authorscollection=req.app.get('authorscollection')
//     articlescollection=req.app.get('articlescollection')
//     next()
// })
const dbobj=require('../server')


//author registration route
authorApp.post('/new-user',expressAsyncHandler(async(req,res)=>{
    //get user
    const newUser=req.body;
    //check for duplicate user based on username
    const dbuser=await dbobj.authorscollection.findOne({username:newUser.username})
    if(dbuser!==null){
        res.send({message:"Author already existed!"})
    }else{
        //hash the password
        newUser.password=await bcryptjs.hash(newUser.password,6)
        //create user
        await dbobj.authorscollection.insertMany([newUser])
        //send res 
        res.send({message:"Author created"})
    }

}))

//author login
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get usercred obj 
    const userCred=req.body;
    //check for username
    const dbuser=await dbobj.authorscollection.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"Invalid username"})
    }else{
        //check for password
       const status=await bcryptjs.compare(userCred.password,dbuser.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
    //create jwt token
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
    //send res
        res.send({message:"login success",token:signedToken,user:dbuser})
       }
    }
}))

//adding new article by author
authorApp.post('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new article
    const newArticle=req.body;
    console.log(req.body)
    //post to artciles collection
    await dbobj.articlescollection.insertMany([newArticle])
    //send res
    console.log("article created")
    res.send({message:"article created"})
    
}))


//modify artcile by author
authorApp.put('/article',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get modified article
    const modifiedArticle=req.body;
    //update by article id
   let result= await dbobj.articlescollection.updateOne({articleId:modifiedArticle.articleId},{$set:{...modifiedArticle}})
   let article=await dbobj.articlescollection.findOne({articleId:modifiedArticle.articleId})
    res.send({message:"Article modified",payload:article})
}))

//delete an article by article ID
authorApp.put('/article/:articleId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get articleId from url
    const artileIdu=Number(req.params.articleId);
    if(req.body.status==true){
        //update status of article to false
        let result=await dbobj.articlescollection.findOneAndUpdate({articleId:artileIdu},{$set:{status:false}},{returnDocument:"after"})
        res.send({message:"Article deleted",payload:result})
    }else{
        //update status of article to false
        let result=await dbobj.articlescollection.findOneAndUpdate({articleId:artileIdu},{$set:{status:true}},{returnDocument:"after"})
        res.send({message:"Article restored",payload:result})
    }
}))


//read articles of author
authorApp.get('/articles/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get author's username
    const authorName=req.params.username;
    //get atricles whose status is true
    const artclesList=await dbobj.articlescollection.find({username:authorName});
    res.send({message:"atricles",payload:artclesList})

}))

//export authorApp
module.exports=authorApp;