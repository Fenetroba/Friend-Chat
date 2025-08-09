import mongoose from 'mongoose'

const messageSchema=new mongoose.Schema({
   senderId:{type:mongoose.Schema.Types.ObjectId,required:true, req:"User"},
   receiverId:{type:mongoose.Schema.Types.ObjectId,required:true,req:"User"},
   text:{type:String},
   Image:{type:String}

},{timestamps:true})

const messages=mongoose.model("message",messageSchema)
export default messages;