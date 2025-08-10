import axios from "axios";

 const instance = axios.create({

  baseURL:"https://friend-chat-i9ge.onrender.com/api",
  withCredentials: true
});
export default instance


