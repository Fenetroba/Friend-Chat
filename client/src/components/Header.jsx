import React, {useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { LogoutUser } from "@/Store/AuthSlice";
import { useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


import { useEffect } from "react";


const Header = ({ auth, user, button }) => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  // Prevent background scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const LogoutHandler = () => {
    dispatch(LogoutUser());
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="sticky top-0 w-full z-40 bg-[var(--four)] text-white shadow">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-extrabold text-[var(--one)]">
          Friend Chat
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4">
          {!auth && (
            <Button className="px-6 text-[var(--one)] hover:bg-[var(--three)] shadow-lg">
              <Link to="/signup">Join Us</Link>
            </Button>
          )}

          {auth ? (
            <Button
              className="rounded-2xl px-6 hover:bg-[var(--three)] border-2 cursor-pointer"
              onClick={LogoutHandler}
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="rounded-2xl px-6 text-[var(--one)] hover:bg-[var(--three)] border-2">
                Login
              </Button>
            </Link>
          )}

          {user && (
            <Link to="/Setting" className="flex items-center gap-2">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.profilePic} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
          )}

          {button && <div className="ml-4">{button}</div>}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {!menuOpen && <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-4/5 max-w-xs text-[var(--three)] bg-white z-50 flex flex-col p-6 md:hidden shadow-lg"
            style={{ minWidth: "260px" }}
          >
            <div className="flex justify-between items-center mb-6">
              {button && <div className="ml-4">{button}</div>}
              <h2 className="text-xl text-[var(--three)] font-bold">Friend Chat</h2>
              <button onClick={toggleMenu} aria-label="Close menu">
                <X className="w-6 h-6" />
              </button>
            </div>

            <Link
              to="/onboarding"
              className="py-2 px-3 hover:text-[#62c022] border w-full rounded-2xl text-[17px] font-semibold mb-2"
              onClick={toggleMenu}
            >
              Join Us
            </Link>

            {auth ? (
              <Button
                className="mt-2 bg-[var(--two2m)] text-[var(--one)] rounded-2xl text-[16px] hover:bg-green-900 w-full"
                onClick={() => {
                  LogoutHandler();
                  toggleMenu();
                }}
              >
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                className="mt-2 text-[16px] w-full"
                onClick={toggleMenu}
              >
                <Button className="bg-[var(--two)] text-[var(--one)] hover:bg-green-900 w-full rounded-2xl">
                  Login
                </Button>
              </Link>
            )}

            {user && (
              <Link to="/profile" className="mt-2" onClick={toggleMenu}>
                <Button className="bg-white text-black w-full flex justify-center items-center gap-2 shadow rounded-2xl">
                  <User /> Profile
                </Button>
              </Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>

     
    </header>
  );
};

export default Header;