import axios from "axios";

 const instance = axios.create({
  baseURL: "https://friend-chat-i9ge.onrender.com",
  withCredentials: true
});
export default instance
// "https://chatapp-stream-backend.onrender.com/api" ||
