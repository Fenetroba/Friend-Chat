import axios from "axios";

 const instance = axios.create({

  baseURL: "http://localhost:5000/api" || "https://chatapp-stream-backend.onrender.com/api",
  withCredentials: true
});
export default instance

  baseURL: "https://friend-chat-i9ge.onrender.com/api",
  withCredentials: true
});
export default instance
// "https://chatapp-stream-backend.onrender.com/api" ||

