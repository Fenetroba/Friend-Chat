import mongoose from 'mongoose'

import bcrypt from 'bcrypt'

const userSchema =new mongoose.Schema({
Fullname:{type:String ,required:true},
email:{type:String, required:true, unique:true },
password:{type :String, required:true},
bio: {
     type: String,
     default: "",
   },
   profilePic: {
     type: String,
     default: "",
   },
   nativeLanguage: {
     type: String,
     default: "",
   },
   learningLanguage: {
     type: String,
     default: "",
   },
   location: {
     type: String,
     default: "",
   },
   isOnboarded: {
     type: Boolean,
     default: false,
   },
   friends: [
     {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
     },
   ],
 },{timestamps:true}

);


userSchema.pre("save",async function (next){
try {
  if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt)
   next()

} catch (error) {
     next(error) 
}

})
// Method to compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
   
export default User;
