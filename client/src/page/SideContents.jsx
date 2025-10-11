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
import { useEffect, useState } from "react";
import { FindUserByName } from "@/Store/FriendSlice";

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
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { myFriend, searchedUsers, isLoading } = useSelector(
    (state) => state.friends
  );
  // Be robust to both shapes: array or { friends: [] }
  const friends = Array.isArray(myFriend) ? myFriend : myFriend?.friends || [];
  const searchedUser = Array.isArray(searchedUsers)
    ? searchedUsers
    : searchedUsers?.users || [];
  const users = user?.user ?? null;

  let Profile = user?.profilePic || "";
  let FullName = user?.Fullname || "";
  if (isAuthenticated && users) {
    Profile = users?.profilePic || "";
    FullName = users?.Fullname || "";
  }
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const chatHandler = (userId) => {
    console.log(userId);
    dispatch(GetMessages(userId));
    dispatch({ type: "friends/setSelectedFriendId", payload: userId });
  };

  // -----------------------------------------------
  const filteredFriends = searchedUser.filter((f) => {
    const searchQuery = searchValue.toLowerCase();
    return f?.Fullname?.toLowerCase().includes(searchQuery);
  });

  useEffect(() => {
    if (searchValue && searchValue.length >= 1) {
      dispatch(FindUserByName(searchValue));
    }
  }, [dispatch, searchValue]);

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

      <div className="h-[70vh] bg-[var(--one)] overflow-auto p-2">
        <div>
          <input
            value={searchValue || ""}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            className="shadow bg-white mb-10 w-full p-1 text-black"
            placeholder="Search Your Friends"
          />

          {isLoading && <p className="text-center text-black">Loading...</p>}
        </div>
        {filteredFriends.length > 0 || searchValue
          ? filteredFriends.map((friend) => (
              <div
                onClick={() => chatHandler(friend._id)}
                key={friend._id}
                className="flex hover:bg-gray-200 border-1 border-[var(--four)] hover:scale-105 duration-200 rounded-2xl cursor-pointer m-1 space-x-2.5"
              >
                <Avatar className="m-4 border-1 border-black text-black bg-blue-200">
                  <AvatarImage src={friend.profilePic} />
                  <AvatarFallback>
                    {friend?.Fullname?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[var(--five)]">{friend.Fullname}</p>
                </div>
              </div>
            ))
          : friends?.map((friend) => (
              <div
                onClick={() => chatHandler(friend._id)}
                key={friend._id}
                className="flex hover:bg-gray-200 border-1 border-[var(--four)] hover:scale-105 duration-200 rounded-2xl cursor-pointer m-1 space-x-2.5"
              >
                <Avatar className="m-4 border-1 border-black text-black bg-blue-200">
                  <AvatarImage src={friend.profilePic} />
                  <AvatarFallback>
                    {friend?.Fullname?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[var(--five)]">{friend.Fullname}</p>
                </div>
              </div>
            ))}
      </div>
      <div className="flex items-center space-x-3 mt-2">
        <Link to="/Setting">
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
