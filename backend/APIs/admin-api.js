//create author api app
const exp=require('express')
const adminApp=exp.Router()
const expressAsyncHandler=require('express-async-handler')
const jsonwebtoken=require('jsonwebtoken')
require("dotenv").config

let admincollection;

adminApp.use((req,res,next)=>{
    admincollection=req.app.get('admincollection')
    next()
})
adminApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get login format
    const admindetails=req.body
    console.log(admindetails.username)
    console.log(admincollection.find())
    //check for admin
    const dbadmin=await admincollection.findOne({username:admindetails.username})
    if(dbadmin===null)
    {
        res.send({message:"invalid admin enter again"})
    }else{
        //check for password
        if(admindetails.password!==dbadmin.password)
        {
            res.send({message:"invalid password enter again"})
        }else{
            //create jwt token and encode it
            const signedtoken=jsonwebtoken.sign({username:dbadmin.username},process.env.SECRET_KEY,{expiresIn:20})
            //send response
            res.send({message:'login sucessful',token:signedtoken,user:dbadmin})
        }
    }
}))

module.exports=adminApp;