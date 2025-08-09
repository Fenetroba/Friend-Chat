import { configureStore } from "@reduxjs/toolkit";

import auth from "./AuthSlice";
import friends from "./FriendSlice";
import Message from "./MessageSlice";
// import chat from "./chatSlice";

export const store = configureStore({
  reducer: {
    auth: auth,
    friends: friends,
    Message:Message
    
  },
});