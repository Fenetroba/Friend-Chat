import React, { useEffect, useState } from 'react'


import {
     ContextMenu,
     ContextMenuContent,
     ContextMenuItem,
     ContextMenuTrigger,
   } from "@/components/ui/context-menu";
const Single_chat = ({ChatMessages,friends,isTyping,messagesEndRef ,user,chatFriend }) => {

     
  return (
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
                 <ContextMenuContent className="border-0 bg-gray-900 rounded-2xl text-white">
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
  )
}

export default Single_chat