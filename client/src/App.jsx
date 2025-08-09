import { Button } from "./components/ui/button";
import { Route, Routes } from "react-router-dom";
import HomePage from "./page/HomePage";
import Loginpage from "./page/Auth/Loginpage";
import SignUp from "./page/Auth/SignUp";
import { Toaster } from "./components/ui/sonner";
import Notification from "./page/Notification";
import OnBoarding from "./page/OnBoarding";
import CallPage from "./page/CallPage";
import { useEffect, useState } from "react";
import { Me } from "./Store/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { Moon, SunDim } from "lucide-react";
import AppSidebar from "./page/SideContents";
import { SidebarProvider } from "./components/ui/sidebar";
import ChatPage from "./page/ChatPage";
import Friends from "./page/Friends";

import { getRecommandedFriend, MyFriends } from "./Store/FriendSlice";
import GetOutGoingReq from "./page/getOutGoingReq";
import PageLoad from "./components/Animation/PageLoad";
import Setting from "./page/Setting";
import ProtectedRoute from "./page/Auth/pageProtecter";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const { isAuthenticated, user,loading } = useSelector((state) => state.auth);
  console.log(isAuthenticated)
  if (!user) {
    <div>
      <PageLoad />
    </div>;
  }
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(Me());
    dispatch(getRecommandedFriend());
    dispatch(MyFriends());
  }, []);
  

  const button = (
    <Button
      onClick={toggleDarkMode}
      className="border-1 bg-[var(--three)] cursor-pointer text-white hover:bg-[var(--two)] rounded-full"
    >
      {darkMode ? <SunDim /> : <Moon />}
    </Button>
  );

  return (
    <div className={`dark ${darkMode ? "dark" : "light"}`}>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <HomePage auth={isAuthenticated} user={user} button={button} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={ <ProtectedRoute isAuthenticated={isAuthenticated}> <  Loginpage user={user} isAuthenticated={isAuthenticated} /></ProtectedRoute>}
        />
        <Route path="/signup" element={ <ProtectedRoute isAuthenticated={isAuthenticated}> <SignUp /></ProtectedRoute>} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute user={user}> <ChatPage user={user} button={button} /></ProtectedRoute>
          }
        />
        <Route
          path="/friends"
          element={
            <ProtectedRoute user={user}>
              <Friends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute user={user}>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute user={user}>
              <OnBoarding user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/call"
          element={
            <ProtectedRoute user={user}>
              <CallPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute user={user}>
              <GetOutGoingReq />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Setting"
          element={
            <ProtectedRoute user={user}>
              <Setting user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
