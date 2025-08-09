import User from "../models/Auth.model.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { upsertStreamUser } from "../lib/stream.js";
export const CreateUser = async (req, res) => {
  try {
    const { Fullname, email, password } = req.body;

 
    if (!Fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


// for checking the user email format
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
 // for checking the user password length if less than 6 characters
    if(password.length < 6) { 
          return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }
// Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({message: `[ ${email} ]this email is already exists` });
    }
//     for create random avatar for user (use reliable DiceBear provider)
    const Inx = Math.floor(Math.random() * 100) + 1;
    const seed = encodeURIComponent(`${Fullname}-${Inx}`);
    const randomAvatar = `https://api.dicebear.com/9.x/thumbs/png?seed=${seed}`;

//     create new users
    const newUser = new User({ Fullname, email, password, profilePic: randomAvatar });
    await newUser.save();

//     for create stream user
   try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.Fullname,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.Fullname}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

//generate JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d"
    });
res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'none',
    });

     // Return success response with token
    return res.status(201).json({success:true, newUser, message: "User created successfully", token });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const LoginUser = async (req, res) => {
   try {
         const {email,password} = req.body;
         if (!email || !password) {     
               return res.status(400).json({ message: "All fields are required" });
          }
           const user = await User.findOne({ email });
         if (!user) {
               return res.status(404).json({ message: "invalid Password or email" });
         }

           const isPasswordValid = await user.comparePassword(password);
           if (!isPasswordValid) {
                  return res.status(400).json({ message: "invalid Password or email" });
               }


              // generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d"
    });
res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'none'
    });

     // Return success response with token
    return res.status(201).json({success:true, user, message: "User logged in successfully"  });

   } catch (error) {
     console.error("Error logging in user:", error);
     return res.status(500).json({ message: "Internal server error" });
   }
};
export const LogOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Onboarding = async (req, res) => {

try {
  const {Fullname,bio,nativeLanguage,learningLanguage,location}=req.body

  if(!Fullname || !bio ||!nativeLanguage || !learningLanguage || !location){
return res.status(400).json({success:false,
  message:'All file are required',
  missingField:[
  !Fullname && 'fullname',
  !bio && 'bio',
  !nativeLanguage && 'nativeLanguage',
  !learningLanguage && 'learningLanguage',
  !location && 'location'
].filter(Boolean) })
  }

  const UpdateUser = await User.findByIdAndUpdate(
    req.UserOne._id,
    {
      Fullname,
      bio,
      nativeLanguage,
      learningLanguage,
      location,
      isOnboarded: true
    },
    { new: true }
  );
if(!UpdateUser) {
  return res.status(404).json({ success: false, message: "User not found" }); 
}
try {
  await upsertStreamUser({
    id: UpdateUser._id.toString(),
    name: UpdateUser.Fullname,
    image: UpdateUser.profilePic,
  });
  console.log(`Stream user updated for ${UpdateUser.Fullname}`);
} catch (error) {
  console.log("Error updating Stream user:", error);
}
  // Return success response
  return res.status(200).json({ success: true, message: "Onboarding completed successfully", user: UpdateUser });
} catch (error) {
  console.error("Error during onboarding:", error);
  return res.status(500).json({ success: false, message: "Internal server error" });
}

}
// Google Sign-In: verify ID token and login/signup
