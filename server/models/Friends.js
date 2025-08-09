import mongoose from "mongoose";

const FriendsListSchema = new mongoose.Schema({
     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
     receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
       status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
     createdAt: { type: Date, default: Date.now }
},{timeseries: true});

export default mongoose.model('FriendsList', FriendsListSchema);