import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import "../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LoginUser } from "@/Store/AuthSlice";

import { toast } from "sonner";
import Loading from "@/components/Animation/Loading";
import SiderImg from "../../assets/hero.jpg";
import api from "@/lib/Axois";


const Loginpage = ({ user }) => {
  console.log("Login user:", user);
  const { loading } = useSelector((state) => state.auth);
  console.log(loading)
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LoginHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(LoginUser(userData));

    if (result.payload?.success || result.meta?.requestStatus === "fulfilled") {
      setUserData({
        email: "",
        password: "",
      });
      toast(result.payload?.message || "Login attempted", {
        style: { background: "#7fe635", color: "#fff" },
      });
      navigate("/");
    } else {
      toast(result.payload?.message || "Login attempted", {
        style: { background: "#570808", color: "#fff" },
      });
    }
  };

  // Redirect to backend Passport Google OAuth flow
  const handleGoogle = () => {
    try {
      const base = api.defaults.baseURL || "http://localhost:5000/api";
      const oauthUrl = `${base}/auth/google/oauth`;
      window.location.href = oauthUrl;
    } catch (e) {
      toast("Unable to start Google sign-in", { style: { background: "#570808", color: "#fff" } });
    }
  };

  return (
    <section>
       <img
              src={SiderImg}
              alt="SiderImg"
              className="absolute top-0 left-0 w-full h-full object-cover backdrop-blur-lg  blur- z-0"
            />
      <Header />
      <div className="relative z-10 magicpattern  ">
        <form
          className="flex sm:h-[90vh] max-sm:h-[95vh] max-sm:w-full flex-col space-y-6 shadow-2xs w-[360px] p-10 bg-gradient-to-br from-[var(--three)] to-[var(--four)]"
          onSubmit={LoginHandler}
        >
          <h2 className="text-2xl font-bold text-white">Login</h2>

          <input
            type="email"
            placeholder="  Email"
            required
            className="p-1 rounded-[10px] bg-white "
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder=" Password"
            className="p-1.5 rounded-[10px] bg-white bg-"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />
          <p className="text-[var(--two)] text-sm">Forgot Password?</p>

          <Button
            className="bg-black rounded-[10px] text-white cursor-pointer hover:bg-gray-700"
            type="submit"
          >
            {loading ? <Loading /> : "Login"}
          </Button>
          <Button type="button" onClick={handleGoogle} className="bg-gray-200 rounded-[10px] text-black cursor-pointer hover:bg-gray-300 flex items-center gap-2">
            Continue With Google <FaGoogle />
          </Button>
          <p className="text-white">
            Don't have an account?{" "}
            <span className="text-[var(--two)] cursor-pointer">
              <Link to="/signup">Sign Up</Link>
            </span>
          </p>
        </form>
        <div className="text-white bg-black px-4.5 shadow-2xl  absolute bottom-6 right-10">
          {" "}
          Built by @FENARO
        </div>
      </div>
    </section>
  );
};

export default Loginpage;
