import { generateStreamToken } from "../lib/stream.js";
import messages from "../models/message.model.js";
import cloudinary from '../lib/cloudinary.js'
export const GetStreamToken = async (req, res) => {
     try {
         const userId = req.UserOne._id;     
           // Assuming you have a function to generate a token
           const token = await generateStreamToken(userId);
           res.status(200).json({
               success: true,
               token
           });
     } catch (error) {
           res.status(500).json({
               success: false,
               message: 'Internal Server Error'
           });
     }
}

export const GetMessage=async(req,res)=>{
try {
     const Myid=req.UserOne._id;
     const {id:UserChatId}=req.params

   const FindMyMessage=await messages.find({

     $or:[{receiverId:UserChatId,senderId:Myid},
          {senderId:UserChatId, receiverId:Myid}
     ]
   }) 

   return res.status(200).json({success:true, FindMyMessage})

} catch (error) {
console.log(error.message)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error'
}); 
 
}



}
export const SendMessage=async(req,res)=>{

  try {
     const {text,image}=req.body;
     const {id:receiverId}=req.params;
     const MyId=req.UserOne._id;

     if ((!text || !String(text).trim()) && !image) {
       return res.status(400).json({ success: false, message: 'Text or image is required' });
     }

     let ImgUrl;
     if(image){
      try {
        const UploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'chat/messages',
          resource_type: 'image'
        });
        ImgUrl = UploadResponse.secure_url;
      } catch (err) {
        console.log('Cloudinary upload error:', err?.message);
        return res.status(500).json({ success: false, message: 'Image upload failed' });
      }
     }
     const NewMessage= new messages({
    text,
    receiverId,
    senderId:MyId,
    Image:ImgUrl

     })

     await NewMessage.save();

     return res.status(200).json({success:true,NewMessage})

  } catch (error) {
    console.log(error.message)
  res.status(500).json({
    success: false,
    message: 'Internal Server Error on SendMessage'
}); 
  }
}
export const DeleteMessage=async(req,res)=>{
  try {
    const Userid = req.UserOne?._id;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Message id is required' });
    }
    if (!Userid) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const msg = await messages.findById(id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Only allow the sender to delete their message (adjust if receivers can also delete)
    if (msg.senderId.toString() !== Userid.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await messages.findByIdAndDelete(id);
    return res.status(200).json({ success: true, deletedId: id });
    
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error on DeleteMessage'
  }); 
    
  }
}

// Update a message's text (only sender can edit)
export const UpdateMessage = async (req, res) => {
  try {
    const Userid = req.UserOne._id;
    const { id } = req.params;
    const { text } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Message id is required' });
    }
    if (!Userid) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Text is required' });
    }

    const msg = await messages.findById(id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (msg.senderId.toString() !== Userid.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    } 

    msg.text = text;
    await msg.save();

    return res.status(200).json({ success: true, updated: { _id: msg._id, text: msg.text } });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      success: false,
      message: 'Internal Server Error on UpdateMessage'
    });
  }
}