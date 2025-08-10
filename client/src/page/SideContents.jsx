import {
  BellPlus,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Settings2,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageLoad from "@/components/Animation/PageLoad";
import { GetMessages } from "@/Store/MessageSlice";
import { useEffect } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Friends",
    url: "/friends",
    icon: User,
  },
  {
    title: "Notification",
    url: "/notification",
    icon: BellPlus,
  },
  {
    title: "Setting",
    url: "/onboarding",
    icon: Settings2,
  },
];

function App_Sidebar({ button }) {
  const { isAuthenticated,user } = useSelector((state) => state.auth);
  const { myFriend } = useSelector((state) => state.friends);
  // Be robust to both shapes: array or { friends: [] }
  const friends = Array.isArray(myFriend) ? myFriend : myFriend?.friends || [];
  const users = user?.user ?? null;

  let Profile = user?.profilePic || "";
  let FullName = user?.Fullname || "";
  if (isAuthenticated && users) {
    Profile = users?.profilePic || "";
    FullName = users?.Fullname || "";
  }

  const dispatch=useDispatch()
  const chatHandler=(userId)=>{
      console.log(userId)
      dispatch(GetMessages(userId))
      dispatch({ type: 'friends/setSelectedFriendId', payload: userId })
    }



  return (
    <Sidebar>
      <SidebarContent className="bg-[var(--four)] text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-10">
            {button}{" "}
            <span className="ml-10 text-[16px] text-white">Freind Chat</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="h-[70vh] bg-[var(--one)] overflow-auto">
        {friends ? (
          friends.map((friendsList) => (
            <div
            onClick={()=>chatHandler(friendsList._id)}
              key={friendsList._id}
              className="flex  hover:bg-gray-200 hover:scale-105 duration-200 rounded-2xl cursor-pointer  m-2  space-x-2.5 "
            >
              <Avatar className="mb-4 border-1 border-black text-black bg-blue-200">
                <AvatarImage src={friendsList.profilePic} />
                <AvatarFallback> {friendsList?.Fullname?.charAt(0) || "?"} </AvatarFallback>
              </Avatar>
              <div className="">
                <p className="text-black">{friendsList.Fullname}</p>
                <p></p>
              </div>
            </div>
          ))
        ) : (
          <div>hi</div>
        )}
      </div>
      <div className="flex items-center space-x-3 mt-2">
        <Link to='/Setting'>
          <Avatar className="mb-4">
            <AvatarImage src={Profile} />
<AvatarFallback> {FullName?.charAt(0) || "?"} </AvatarFallback>
          </Avatar>
        </Link>
        <p>@{FullName}</p>
      </div>
    </Sidebar>
  );
}

export default App_Sidebar;
