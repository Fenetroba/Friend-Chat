import { Button } from "@/components/ui/button";
import { Plus, UserPlus2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import friends from "../assets/friends.png";
import {
  SendRequest,
  FindUserByName,
  GetOutGoingRequest,
  IncomeFriendsRequest,
  getRecommandedFriend,
} from "@/Store/FriendSlice";
import { toast } from "sonner";
const CreateRequest = () => {
  const {recommendedUsers,isLoading}=useSelector(state=>state.friends)
  useEffect(() => {
   getRecommandedFriend()
   console.log(recommendedUsers)
  }, []);


    const dispatch=useDispatch()
const RequestHandler=(UserId)=>{
dispatch(SendRequest(UserId)).then((result) => {
  console.log('RequestAccept result:', result);
  if (result.payload?.success) {
    toast.success("Request sended successfully!", {
      style: { background: "#7fe635", color: "#fff" },
    });
    // Refresh the requests
    dispatch(GetOutGoingRequest());
    dispatch(IncomeFriendsRequest());
  } else {
    toast.error(result.payload?.message || "Failed to accept request", {
      style: { background: "#570808", color: "#fff" },
    });
  }
});
};
  return (
    <div>
      <div className=" m-3 p-1">
        
          <h2 className="  text-2xl font-bold  p-2  text-white bg-[var(--two)] ">
            Meet New Friends
          </h2>
         

          <div className=" gap-2 flex overflow-auto   p-3 shadow-2xl ">
            {recommendedUsers.length === 0 && (
              <p className="text-white/70">
                {isLoading
                  ? "Loading recommendations..."
                  : (
                      <div className="sm:flex items-center gap-2">
                        <img src={friends} alt="friends" />
                        <p>no users found</p>
                      </div>
                    )}
              </p>
            )}
            {recommendedUsers.recommendedUsers.map((user) => (
              <div
                key={user._id}
                className="bg-black  w-[400px] rounded-2xl text-white p-3 "
              >
                <Avatar className="mb-4 border-1 bg-blue-500/20">
                  <AvatarImage src={user.profilePic} />
                  <AvatarFallback>{user.Fullname?.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="m-2">{user.Fullname}</p>
                <div className="flex gap-10">
                  <p className="bg-[var(--three)] px-4 text-white p-1 rounded-2xl">
                    {user.nativeLanguage}
                  </p>
                  <p className="bg-[var(--two)] px-4 text-white p-1 rounded-2xl">
                    {user.location}
                  </p>
                </div>
                <div onClick={() => RequestHandler(user._id)}>
                  <button className=" flex  text-center gap-2.5 w-full mt-3 bg-[var(--two)] cursor-pointer rounded-2xl text-white p-2 ">
                    <p> Send Request</p> <UserPlus2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
      
      </div>
    </div>
  );
};

export default CreateRequest;
