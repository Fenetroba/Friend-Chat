import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetOutGoingRequest, IncomeFriendsRequest, RequestAccept } from "../Store/FriendSlice";
import PageLoad from "@/components/Animation/PageLoad";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SiderImg from "../assets/hero.jpg";
import "../App.css";
import { toast } from "sonner";

const GetOutGoingReq = () => {
  const dispatch = useDispatch();

  const { GoingRequest, IncomeRequest, isLoading, error } = useSelector(
    (state) => state.friends
  );
  const [IsInOrOut, setIsInOrOut] = useState("send");

  useEffect(() => {
    dispatch(GetOutGoingRequest());
    dispatch(IncomeFriendsRequest());
  }, [dispatch]);

  // Refresh requests after successful accept
  useEffect(() => {
    if (!isLoading && !error) {
      // This will run when loading is complete and there's no error
      // indicating a successful operation
    }
  }, [isLoading, error]);

  if (isLoading) {
    return (
      <div>
        <PageLoad />
      </div>
    );
  }

  const handleTabChange = (tab) => {
    setIsInOrOut(tab);
  };

  const statusHandler = (requestId) => {
   
    
    dispatch(RequestAccept(requestId)).then((result) => {
      console.log('RequestAccept result:', result);
      if (result.payload?.success) {
        toast.success("Friend request accepted successfully!", {
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
    <section className="flex items-center ">
      <div className="flex flex-col w-full sm:w-[30%]  md:w-[50%]   h-[100vh] bg-gradient-to-br from-[var(--four)] to-[var(--four)] backdrop-blur-sm text-[var(--one)] shadow-lg border border-white/20 p-6">
        {/* Tab Buttons */}
        <div className="flex space-x-4 justify-center mb-6">
          <Button
            onClick={() => handleTabChange("send")}
            className={`relative border cursor-pointer rounded-[10px] px-4 py-2 transition-all duration-200 ${
              IsInOrOut === "send"
                ? "bg-[var(--three)] text-white shadow-lg"
                : "bg-transparent hover:bg-white/10"
            }`}
          >
            Sent Request
            <span className="absolute -top-2 -right-2 bg-[var(--one)] text-[var(--five)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {GoingRequest?.length || 0}
            </span>
          </Button>

          <Button
            onClick={() => handleTabChange("come")}
            className={`relative border cursor-pointer rounded-[10px] px-4 py-2 transition-all duration-200 ${
              IsInOrOut === "come"
                ? "bg-[var(--three)] text-white shadow-lg"
                : "bg-transparent hover:bg-white/10"
            }`}
          >
            Come Request
            <span className="absolute -top-2 -right-2 bg-[var(--one)] text-[var(--five)] text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {IncomeRequest?.length || 0}
            </span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {IsInOrOut === "send" ? (
            // Outgoing Requests Tab
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Sent Friend Requests
              </h3>
              {GoingRequest && GoingRequest.length > 0 ? (
                GoingRequest.map((request, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Profile Avatar */}

                        <Avatar className="border-1">
                          <AvatarImage src={request.receiver?.profilePic} />
                          <AvatarFallback>
                          U
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {request.receiver?.Fullname || "Unknown User"}
                          </h4>
                          <div className="flex gap-2 text-xs text-gray-300 mt-1">
                            <span>
                              Native:{" "}
                              {request.receiver?.nativeLanguage || "N/A"}
                            </span>
                            <span>
                              Learning:{" "}
                              {request.receiver?.learningLanguage || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                          {request.status}
                        </span>
                       
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No sent requests yet</p>
                </div>
              )}
            </div>
          ) : (
            // Incoming Requests Tab
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">
                Incoming Friend Requests
              </h3>
              {IncomeRequest && IncomeRequest.length > 0 ? (
                IncomeRequest.map((request, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Profile Avatar */}
                        <Avatar className="border-1">
                          <AvatarImage src={request.profilepic} />
                          <AvatarFallback>
                            {" "}
                            {request.sender?.Fullname?.charAt(
                              0
                            )?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">
                            {request.sender?.Fullname || "Unknown User"}
                          </h4>
                          <div className="flex gap-2 text-xs text-gray-300 mt-1">
                            <span>
                              Native: {request.sender?.nativeLanguage || "N/A"}
                            </span>
                            <span>
                              Learning:{" "}
                              {request.sender?.learningLanguage || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => statusHandler(request._id)}
                          className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30 hover:bg-green-500/30 transition-colors"
                        >
                          Accept
                        </button>
                        <button className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30 hover:bg-red-500/30 transition-colors">
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No incoming requests</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <Button
            onClick={() => {
              dispatch(GetOutGoingRequest());
              dispatch(IncomeFriendsRequest());
            }}
            className="w-full bg-[var(--two)] hover:bg-[var(--three)] text-white rounded-lg transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      <div className="relative w-10/12 h-[100vh] z-10 overflow-hidden">
        <img
          src={SiderImg}
          alt="SiderImg"
          className="absolute top-0 left-0 w-full h-full object-cover backdrop-blur-lg  blur- z-0"
        />

        <div className="relative z-10 rotate-180 magicpattern h-[100vh]"></div>
      </div>
    </section>
  );
};

export default GetOutGoingReq;
