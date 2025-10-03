import { Button } from "@/components/ui/button";
import { Plus, UserPlus2 } from "lucide-react";
import React, { useMemo, useState } from "react";
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
  const [query, setQuery] = useState("");
  const { searchedUsers, recommendedUsers, isLoading } = useSelector(
    (state) => state.friends
  );
  const normalizedSearched = Array.isArray(searchedUsers)
    ? searchedUsers
    : searchedUsers?.friends || searchedUsers?.users || [];
  const normalizedRecommended = Array.isArray(recommendedUsers)
    ? recommendedUsers
    : recommendedUsers?.friends || recommendedUsers?.users || [];
  console.log(recommendedUsers);
  // Randomize and limit to max 10 users
  const randomUsers = useMemo(() => {
    const pool = query.trim() ? normalizedSearched : normalizedRecommended;
    const arr = [...pool];
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 10);
  }, [normalizedSearched, normalizedRecommended, query]);

  console.log(normalizedRecommended);
  const dispatch = useDispatch();
  // Ensure recommendations are loaded when input is empty
  React.useEffect(() => {
    if (!query.trim() && normalizedRecommended.length === 0) {
      dispatch(getRecommandedFriend());
    }
  }, [dispatch, query, normalizedRecommended.length]);
  const RequestHandler = (UserId) => {
    dispatch(SendRequest(UserId)).then((result) => {
      console.log("RequestAccept result:", result);
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
  console.log(randomUsers);

  return (
    <div className="flex max-sm:flex-col  backdrop-blur-lg ">
      <div className="shadow-2xl sm:w-full m-3 p-1">
        <div>
          <div className="sm:m-7 max-sm:p-2 rounded-2xl sm:flex justify-around items-center text-white shadow-2xl text-2xl bg-[var(--two)]">
            <h2 className="text-center  text-2xl font-bold m-7 p-2 rounded-2xl ">
              Meet New Friends
            </h2>
            <input
              type="text"
              className="shadow-md border-1 border-amber-50 rounded-2xl max:sm-mb-5 text-[16px] max-sm:w-full max-sm:mt-2 p-2 w-full sm:w-1/2 "
              placeholder="Search users"
              value={query}
              onChange={(e) => {
                const v = e.target.value;
                setQuery(v);
                const t = v.trim();
                if (t) {
                  dispatch(FindUserByName(t));
                }
              }}
            />
          </div>
          <div className="flex overflow-x-auto gap-2 items-center p-10 shadow-2xl ">
            {randomUsers.length === 0 && (
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
            {randomUsers.map((user) => (
              <div
                key={user._id}
                className="hover:scale-105 bg-[var(--one)] w-[400px] rounded-2xl text-[var(--five)] p-10 "
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
