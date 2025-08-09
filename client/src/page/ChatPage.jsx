import React from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import App_Sidebar from "./SideContents";
import MainChat from "@/components/MainChat";
import { useLocation } from "react-router-dom";
import Friends from "./Friends";
const ChatPage = ({ button,user }) => {
  const location = useLocation();
  return (
    <div>
      <div className=" relative overflow-hidden">
        <SidebarProvider>
          <div className="flex-none">
            <App_Sidebar user={user}  button={button} />
          </div>
          <SidebarTrigger className="bg-[var(--two)] cursor-pointer rounded-2xl" />

          <div className="flex-1 sm:p-6 p-1 ">
            <MainChat user={user} />
          </div>
        </SidebarProvider>
        <div className="bg-[var(--four)] w-[550px] h-[550px]  shadow-2xl rounded-full absolute z-[-10] top-[-100px] right-[-100px]"></div>
      </div>
    </div>
  );
};

export default ChatPage;
