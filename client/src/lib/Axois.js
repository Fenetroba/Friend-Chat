import axios from "axios";

 const instance = axios.create({

  baseURL: "http://localhost:5000/api" || "https://friend-chat-i9ge.onrender.com/api",
  withCredentials: true
});
export default instance

  

