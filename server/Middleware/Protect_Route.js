import env from 'dotenv'
import jwt from "jsonwebtoken"
import User from "../models/Auth.model.js"


export const Protect_router=async (req,res,next)=>{


     try {
          const Token=req.cookies.token;

          if(!Token){
               return res.status(401).json({success:false,message:"unAuthorized User [Token not Provide]"})
          }
     const decode=jwt.verify(Token , process.env.JWT_SECRET_KEY)

     if(!decode){
          return res.status(401).json({success:false,message:"unAuthorized User [InValid Token]"})
     }

     const Users=await User.findById(decode.userId).select("-password")

     if(!Users){
          return res.status(401).json({success:false,message:"unAuthorized User [User Not Found]"})

     }
     req.UserOne=Users
     next()

     } catch (error) {
          console.log("error is create on middlewear",error)
          return res.status(500).json({success:false,message:{error:error.message}})
     }
}