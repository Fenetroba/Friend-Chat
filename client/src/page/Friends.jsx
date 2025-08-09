import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateRequest from "@/components/CreateRequest";
import { useSelector } from "react-redux";
import TopeNav from "@/components/TopeNav";
import { Link } from "react-router-dom";

const Friends = () => {
  const { myFriend, isLoading } = useSelector((state) => state.friends);
  
  const friends = myFriend.friends;
  useEffect(()=>{

  },[])

  return (
    <section className="magicpattern w-auto h-auto backdrop-blur-sm">
      <TopeNav />
      <div className="flex max-sm:flex-col  ">
        <div className="w-full ">
          {myFriend.length === 0 ? (
            <div className="text-center text-gray-500">
              <h2>No friend yet</h2>
              <p>
                connect with language partner below to start practising together
                !
              </p>
            </div>
          ) : (
            <div className="backdrop-blur-sm">
              <div className="sm:m-7  p-2 rounded-2xl sm:flex justify-around items-center  shadow-2xl text-2xl bg-white">
                <h2 className="font-bold ">My Friends</h2>
                <div className="flex items-center ">
                  <input
                    type="text"
                    className="shadow-lg text-[16px] max-sm:w-full max-sm:mt-8 p-2"
                    placeholder="Search"
                  />{" "}
                  <Search className="bg-amber-200 h-9 w-8 p-2 rounded-r-2xl"/>
                </div>
              </div>
              <div className="flex gap-2 items-center p-10 overflow-x-auto">
                {friends.map((myfriend) => (
                  <div
                    key={myfriend._id}
                    className="bg-[var(--one)] shadow-2xl rounded-2xl text-[var(--five)] p-10 min-w-[300px] flex-shrink-0"
                  >
                    <div className="flex gap-3 items-center">
                      <Avatar className="mb-4">
                        <AvatarImage src={myfriend.profilePic} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <p className="m-2">{myfriend.Fullname}</p>
                    </div>
                    <div className="flex gap-10">
                      <p className="bg-[var(--three)] px-4 text-white p-1 rounded-2xl">
                        {myfriend.nativeLanguage}
                      </p>
                      <p className="bg-[var(--two)] px-4 text-white p-1 rounded-2xl">
                        {myfriend.location}
                      </p>
                    </div>
                  <Link to='/chat'>
                  <Button className="w-full mt-3 border-1 cursor-pointer rounded-2xl hover:blur-[2px]">
                      Message
                    </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <CreateRequest />
        </div>
      </div>
    </section>
  );
};

export default Friends;
