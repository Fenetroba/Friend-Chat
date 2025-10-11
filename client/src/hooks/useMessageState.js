import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { DeleteMessage, GetMessages } from '@/Store/MessageSlice';

export const useMessageState = (chatFriend) => {
  const dispatch = useDispatch();
  
  // Message state
  const [newMessage, setNewMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState(null);
  
  // File attachment state
  const fileInputRef = useRef(null);
  const [attachedImage, setAttachedImage] = useState(null); // base64
  const [attachedPreview, setAttachedPreview] = useState(null); // data URL

  // Message handlers
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
    setSendError(null);
  };

  const handleEdit = (id, currentText) => {
    if (!id) return;
    setIsEditing(true);
    setEditingId(id);
    setNewMessage(currentText || "");
    setIsTyping(Boolean(currentText));
    setSendError(null);
    setAttachedImage(null);
    setAttachedPreview(null);
  };

  const handleDelete = async (messageId) => {
    if (!messageId) return;
    try {
      await dispatch(DeleteMessage(messageId)).unwrap();
      if (chatFriend?._id) {
        dispatch(GetMessages(chatFriend._id));
      }
      toast.success('Message deleted successfully');
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleForward = (message) => {
    if (!message) return;
    // TODO: Implement forward functionality
    console.log('Forwarding message:', message);
    toast.info('Forward message functionality coming soon');
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success('Message copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
        toast.error('Failed to copy message');
      });
  };

  // File attachment handlers
  const handleAttachClick = () => {
    if (isEditing) return;
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
      setAttachedImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachedImage(null);
    setAttachedPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return {
    // State
    newMessage,
    isEditing,
    editingId,
    isTyping,
    sendLoading,
    sendError,
    attachedImage,
    attachedPreview,
    fileInputRef,
    
    // Handlers
    setNewMessage,
    setIsEditing,
    setEditingId,
    setSendLoading,
    setSendError,
    handleTyping,
    handleEdit,
    handleDelete,
    handleForward,
    handleCopy,
    handleAttachClick,
    handleFileChange,
    removeAttachment,
  };
};

export default useMessageState;
