import { Button } from "@/components/ui/button";
import { Plus, UserPlus2 } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { SendRequest } from "@/Store/FriendSlice";
import { toast } from "sonner";

const CreateRequest = () => {
  const { recommendedUsers } = useSelector(state => state.friends);
  const recommendedUser = recommendedUsers.recommendedUsers || [];
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
    <div className="flex max-sm:flex-col  backdrop-blur-lg ">
      <div className="shadow-2xl w-full">
        <div>
          <h2 className="text-center  text-2xl font-bold m-7 p-2 rounded-2xl shadow-2xl backdrop-blur-3xl bg-white">
            Meet New Friends
          </h2>
          <div className="flex max-sm:flex-col gap-2 items-center p-10">
            {recommendedUser.map((user) => (
              <div key={user._id} className="bg-[var(--one)] rounded-2xl text-[var(--five)] p-10">
                <Avatar className="mb-4">
                  <AvatarImage src={user.profilePic} />
                  <AvatarFallback>{user.Fullname?.[0]}</AvatarFallback>
                </Avatar>
                <p className="m-2">{user.Fullname}</p>
                <div className="flex gap-10">
                  <p className="bg-[var(--three)] px-4 text-white p-1 rounded-2xl">{user.nativeLanguage}</p>
                  <p className="bg-[var(--two)] px-4 text-white p-1 rounded-2xl">{user.location}</p>
                </div>
          <div onClick={()=>RequestHandler(user._id)}>
                  <button className=" flex  text-center gap-2.5 w-full mt-3 bg-[var(--two)] cursor-pointer rounded-2xl text-white p-2 ">
                 <p> Send Friend Request</p> <UserPlus2 />
                </button>
          </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRequest;
