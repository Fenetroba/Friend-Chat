import cloudinary from "../lib/cloudinary.js";
import User from "../models/Auth.model.js";
import Friends from "../models/Friends.js";

export const RecommendedUsers = async (req, res) => {
  try {
    const CurrentUserId = req.UserOne._id; // Use correct property
    const user = req.UserOne;
    // console.log(user);

    const recommendedUsers = await User.find({
      _id: { $ne: CurrentUserId, $nin: user.friends || [] }, // Corrected query
      isOnboarded: true,
    })
      .select('-password -__v')
      .limit(10);

    res.status(200).json({
      success: true,
      recommendedUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
    console.log(error.message);
  }
};
export const FriendsList = async (req, res) => {
    try {
        const CurrentUserId = req.UserOne.id;
      const user = await User.findById(CurrentUserId)
  .select('friends')
  .populate('friends', 'Fullname profilePic nativeLanguage learningLanguage location isOnboarded')
  .lean();
          
        res.status(200).json({
            success: true,
            friends: user.friends
        });
   
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}
export const RequestFriend = async (req, res) => {
  try {
    const CurrentUserId = req.UserOne._id; // assumes middleware adds `UserOne`
    const { friendId } = req.params;

    if (CurrentUserId.toString() === friendId) {
      return res.status(400).json({ success: false, message: 'You cannot send a friend request to yourself' });
    }

    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }

    const isAlreadyFriends = await User.findOne({
      _id: CurrentUserId,
      friends: friendId,
    });

    if (isAlreadyFriends) {
      return res.status(400).json({ success: false, message: 'Already friends with this user' });
    }

    const existingRequest = await Friends.findOne({
      $or: [
        { sender: CurrentUserId, receiver: friendId },
        { sender: friendId, receiver: CurrentUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Friend request already exists' });
    }

    const newRequest = await Friends.create({
      sender: CurrentUserId,
      receiver: friendId,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      request: newRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export const RequestFriend_accept = async (req, res) => {
  try {
    const CurrentUserId = req.UserOne._id; // authenticated user ID
    const { requestId } = req.params;

    const friendRequest = await Friends.findOne({
      _id: requestId,  // Fixed: using '_id' instead of 'id'
      receiver: CurrentUserId,
      status: 'pending',
    });
    console.log('Friend request found:', friendRequest);

    if (!friendRequest) {
      return res.status(404).json({
        success: false,
        message: 'Friend request not found or already accepted',
      });
    }

    // Accept the friend request
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add friends bi-directionally
    await User.findByIdAndUpdate(CurrentUserId, {
      $addToSet: { friends: friendRequest.sender },
    });
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: CurrentUserId },
    });

    res.status(200).json({
      success: true,
      message: 'Friend request accepted successfully',
      data: friendRequest
    });
  } catch (error) {
    console.error('Error accepting friend request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const FriendsRequest = async (req, res) => {
  try {
    const CurrentUserId = req.UserOne._id; // <-- FIXED
    const IncomeRequest = await Friends.find({
      receiver: CurrentUserId, // <-- receiver, not sender, for incoming requests
      status: "pending",
    }).populate("sender", "Fullname profilePic nativeLanguage learningLanguage");

    const acceptedReq = await Friends.find({
      receiver: CurrentUserId,
      status: 'accepted'
    }).populate('sender', 'Fullname bio');

    return res.status(200).json({
      success: true,
      data: {
        IncomeRequest,
        acceptedReq
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
export const getOutGoingReq = async (req, res) => {
  try {
    const CurrentUserId = req.UserOne._id; // <-- FIXED
    const ReqOutGo = await Friends.find({
      sender: CurrentUserId,
      status: "pending"
    }).populate("receiver", "Fullname profilePic nativeLanguage learningLanguage");

    return res.status(200).json({ success: true, ReqOutGo });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
};
export const UpDateProfile=async(req,res)=>{

  try {
    const {profilePic}=req.body;
   
    const Userid=req.UserOne._id;


    const UploadImgToCloud=await cloudinary.uploader.upload(profilePic);

    const UpdateUserProfile=await User.findByIdAndUpdate(Userid,{profilePic:UploadImgToCloud.secure_url},{new:true})

    return res.status(200).json({success:true,UpdateUserProfile})
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }

}
export const AllUsers = async (req, res) => {
  try {
    // Route is GET /all_users/:name
    const { name = "" } = req.params || {};
    const query = String(name || "").trim();

    const CurrentUserId = req.UserOne._id;

    if (!query) {
      // Return empty array if query is empty to avoid broad fetch
      return res.status(200).json({ success: true, users: [] });
    }

    const users = await User.find({
      Fullname: { $regex: query, $options: 'i' },
      _id: { $ne: CurrentUserId },
      friends: { $nin: CurrentUserId },
    }).select('Fullname profilePic nativeLanguage learningLanguage location');

    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};