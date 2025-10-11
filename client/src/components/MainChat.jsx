import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  X,
} from "lucide-react";
import PageLoad from "./Animation/PageLoad";
import { SendMessages, GetMessages, DeleteMessage, UpdateMessage } from "@/Store/MessageSlice";
import friends from "../assets/friends.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocation } from "react-router-dom";
import { getSocket, subscribeToOnlineUsers, setUserOnline } from "../lib/socket";
import Single_chat from "./Single_chat";

const MainChat = ({ user }) => {
  const location = useLocation();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Set user as online when component mounts
    if (user?._id) {
      setUserOnline(user._id);
    }

    // Subscribe to online users updates
    const unsubscribe = subscribeToOnlineUsers((users) => {
      setOnlineUsers(users);
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [user?._id]);

  // Your existing socket join logic
  useEffect(() => {
    if (location.pathname === "/chat" && user?._id) {
      const socket = getSocket();
      socket.emit("join", user._id);
    }
  }, [location.pathname, user?._id]);
 

  if (!user) {
    return (
      <div>
        <PageLoad />
      </div>
    );
  }

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { message, loading } = useSelector((state) => state.Message);
  const [newMessage, setNewMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [isTyping, setIsTyping] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachedImage, setAttachedImage] = useState(null); // base64
  const [attachedPreview, setAttachedPreview] = useState(null); // data URL
  const { myFriend } = useSelector((state) => state.friends);
  const ChatMessages = Array.isArray(message?.FindMyMessage)
    ? message.FindMyMessage
    : [];
  const chatUser = Array.isArray(myFriend?.friends) ? myFriend.friends : [];
  const selectedFriendId = useSelector(
    (state) => state.friends.selectedFriendId
  );

  // Always select chatFriend from selectedFriendId if available
  const chatFriend = selectedFriendId
    ? chatUser.find((friend) => friend._id === selectedFriendId)
    : ChatMessages.length > 0
    ? chatUser.find(
        (friend) =>
          friend._id ===
          (ChatMessages[0].senderId === user._id
            ? ChatMessages[0].receiverId
            : ChatMessages[0].senderId)
      )
    : chatUser.find((friend) => friend._id === user._id);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSendError(null);
    if (!chatFriend) {
      setSendError("No chat friend selected.");
      return;
    }
    // Allow sending if text OR image is present (when not editing).
    if (!isEditing && !newMessage.trim() && !attachedImage) return;
    if (isEditing && !newMessage.trim()) return;
    setSendLoading(true);
    try {
      if (isEditing && editingId) {
        await dispatch(UpdateMessage({ id: editingId, text: newMessage.trim() }));
        setIsEditing(false);
        setEditingId(null);
      } else {
        await dispatch(
          SendMessages({
            receiverId: chatFriend._id,
            data: { senderId: user._id, text: newMessage, image: attachedImage },
          })
        );
      }
      await dispatch(GetMessages(chatFriend._id));
      setNewMessage("");
      setIsTyping(false);
      setAttachedImage(null);
      setAttachedPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setSendError(err?.message || "Failed to send message");
    } finally {
      setSendLoading(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
    setSendError(null);
  };
  if (loading) {
    return <PageLoad />;
  }

  const DeletHandler = async (MessageId) => {
    if (!MessageId) return; // guard against undefined
    dispatch(DeleteMessage(MessageId));
    if (chatFriend?._id) {
      dispatch(GetMessages(chatFriend._id));
    }
  };
  const EditHandler = (id, currentText) => {
    if (!id) return;
    setIsEditing(true);
    setEditingId(id);
    setNewMessage(currentText || "");
    setIsTyping(Boolean(currentText));
    setSendError(null);
    // Clear any pending attachment during edit
    setAttachedImage(null);
    setAttachedPreview(null);
  };

  // Attachment handlers
  const handleAttachClick = () => {
    if (isEditing) return; // disable attaching while editing
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setSendError("Only image files are supported.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setAttachedPreview(dataUrl);
      // Send base64 string without the prefix for backend if desired; for now pass dataUrl
      setAttachedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-[90vh] max-h-[90vh] max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[var(--four)] to-[var(--three)] text-white border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">
              {chatFriend && (
                <img
                  src={chatFriend.profilePic}
                  alt={chatFriend.Fullname.charAt(0)}
                  className="w-10 h-10 rounded-full   object-cover"
                />
              )}
            </span>
          </div>
          <div>
            <div className="font-bold text-lg">
              {" "}
              {chatFriend?.Fullname || "No Friend Selected"}
            </div>
            <div className="flex items-center gap-2 text-xs opacity-80">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
         
          <DropdownMenu>
  <DropdownMenuTrigger > <MoreVertical className="w-5 h-5" /></DropdownMenuTrigger>
  <DropdownMenuContent className='border-0 rounded-2xl backdrop-blur-2xl'>
   
    <DropdownMenuItem className="hover:font-bold cursor-pointer">Profile</DropdownMenuItem>
    <DropdownMenuItem className="hover:font-bold cursor-pointer">Delet All Text</DropdownMenuItem>
    <DropdownMenuItem className="hover:font-bold cursor-pointer">Block User</DropdownMenuItem>
    <DropdownMenuItem className="hover:font-bold cursor-pointer">Delet All</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
        </div>
      </div>

      {/* Chat Messages */}
 <Single_chat ChatMessages={ChatMessages} friends={friends } isTyping ={isTyping } messagesEndRef ={messagesEndRef } user={user}/>

      {/* Chat Input */}
      {isEditing && (
        <div className="px-4 py-2 bg-yellow-50 border-t border-b border-yellow-200 text-yellow-800 text-sm flex items-center justify-between">
          <span>Editing message…</span>
          <button
            type="button"
            onClick={() => { setIsEditing(false); setEditingId(null); setNewMessage(""); setIsTyping(false); }}
            className="text-yellow-900 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 px-4 py-4 bg-white border-t border-gray-200"
      >
        <button
          type="button"
          onClick={handleAttachClick}
          title={isEditing ? "Finish editing to attach" : "Attach image"}
          className={`p-2 rounded-lg transition-colors ${
            isEditing
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex-1 relative">
          {attachedPreview && !isEditing && (
            <div className="absolute -top-20 left-0 bg-white border border-gray-200 rounded-xl shadow p-2 flex items-center gap-2">
              <img src={attachedPreview} alt="preview" className="w-14 h-14 object-cover rounded-lg border" />
              <button
                type="button"
                onClick={() => { setAttachedImage(null); setAttachedPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                className="p-1 text-gray-600 hover:text-red-600"
                title="Remove attachment"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder={isEditing ? "Edit your message…" : "Type your message..."}
            className="w-full px-4 py-3 pr-12 rounded-2xl border border-gray-300 outline-none focus:ring-2 focus:ring-[var(--two)] focus:border-transparent transition-all duration-200 bg-gray-50 text-gray-800 placeholder-gray-500"
            disabled={sendLoading}
          />
          {sendError && (
            <div className="text-red-500 text-xs mt-1">{sendError}</div>
          )}
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={sendLoading || (isEditing ? !newMessage.trim() : (!newMessage.trim() && !attachedImage))}
          className="bg-gradient-to-r from-[var(--two)] to-[var(--three)] hover:from-[var(--three)] hover:to-[var(--two)] disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-2xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {sendLoading ? (
            <span className="loader w-5 h-5 border-2 border-t-2 border-t-white border-gray-300 rounded-full animate-spin"></span>
          ) : (
            isEditing ? <span className="px-2">Save</span> : <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MainChat;
