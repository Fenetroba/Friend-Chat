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
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
const MainChat = ({ user }) => {
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
    <div className="flex flex-col h-[80vh] max-h-[90vh] max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
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
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gradient-to-br magicpattern  backdrop-blur-2xl space-y-4">
        {/* Render messages from Redux store */}
        {ChatMessages.length > 0 ? (
          ChatMessages.map((msg, idx) => {
            const isSender = msg.senderId === user._id;
            return (
              <div
                key={idx}
                className={`flex flex-col ${
                  isSender ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={
                    isSender
                      ? "flex items-center space-x-1.5 bg-gradient-to-r from-[var(--two)] to-[var(--three)] text-white px-4 py-3 rounded-2xl max-w-xs lg:max-w-md text-sm shadow-md"
                      : "flex items-center space-x-1.5 bg-white text-gray-800 px-4 py-3 rounded-2xl max-w-xs lg:max-w-md text-sm shadow-md border border-gray-200"
                  }
                >
                  <ContextMenu>
                    <ContextMenuTrigger className="flex items-start space-x-3">
                      {" "}
                      <img
                        src={
                          isSender ? user?.profilePic : chatFriend?.profilePic
                        }
                        alt={isSender ? user?.Fullname : chatFriend?.Fullname}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex flex-col gap-2">
                        {msg?.Image && (
                          <img
                            src={msg.Image}
                            alt="attachment"
                            className="max-w-[220px] lg:max-w-[320px] rounded-xl border border-white/20 shadow-sm"
                          />
                        )}
                        {msg?.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="border-0 bg-gray-400 rounded-2xl">
                      <ContextMenuItem
                        onClick={() => DeletHandler(msg._id)}
                        className="hover:font-bold cursor-pointer "
                      >
                        Delete
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => EditHandler(msg._id, msg.text)}
                        className="hover:font-bold cursor-pointer "
                      >
                        Edit
                      </ContextMenuItem>
                      <ContextMenuItem>forward</ContextMenuItem>
                      <ContextMenuItem>copy</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {msg.time || ""}
                  </span>
                  {isSender ? (
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span className="text-xs text-gray-400">• Seen</span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-lg">
            <img src={friends} alt="friends" className="w-100" />
            <p className="bg-black text-white px-5">No Message Yet</p>
          </div>
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl max-w-xs text-sm shadow-md border border-gray-200">
              <div className="flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

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
