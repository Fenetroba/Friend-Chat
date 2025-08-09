import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/Store/AuthSlice";
import SiderImg from "../../assets/hero.jpg";
import api from "@/lib/Axois";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = React.useState({
    Fullname: "",
    email: "",
    password: "",
  });
  const SignUpHandler = async (e) => {
    e.preventDefault();

    const result = await dispatch(register(userData));
    // Reset userData after registration

    if (result.payload?.success || result.meta?.requestStatus === "fulfilled") {
      setUserData({
        Fullname: "",
        email: "",
        password: "",
      });
      toast(result.payload?.message || "Registration attempted", {
        style: { background: "#7fe635", color: "#fff" },
      });
      navigate("/onboarding");
    } else {
      toast(result.payload?.message || "Registration attempted", {
        style: { background: "#570808", color: "#fff" },
      });
    }
  };

  // Redirect to backend Passport Google OAuth flow
  const handleGoogle = () => {
    try {
      // Build absolute URL to backend OAuth endpoint based on Axios baseURL
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
      <div className="relative z-10  magicpattern  ">
        <form
          className="max-sm:h-[95vh] sm:h-[90vh] max-sm:w-full  flex flex-col shadow-2xs  space-y-6  w-[360px] p-10 [400px] bg-gradient-to-br from-[var(--three)] to-[var(--four)] "
          onSubmit={SignUpHandler}
        >
          <h2 className="text-2xl font-bold text-white">Create an account</h2>

          <input
            type="text"
            placeholder=" Fullname"
            className="p-1.5 rounded-[10px] bg-white bg-"
            value={userData.Fullname}
            onChange={(e) =>
              setUserData({ ...userData, Fullname: e.target.value })
            }
          />

          <input
            type="email"
            placeholder=" Email"
            className="p-1 rounded-[10px] bg-white bg-"
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

          <Button
            className="bg-black rounded-[10px] text-white cursor-pointer hover:bg-gray-700"
            type="submit"
          >
            Sign Up
          </Button>
          <Button onClick={handleGoogle} type="button" className="bg-gray-200 rounded-[10px] text-black cursor-pointer hover:bg-gray-300 flex items-center gap-2">
            Continue With Google <FaGoogle />
          </Button>
          <p className="text-white">
            I have an account?{" "}
            <span className="text-[var(--two)] cursor-pointer">
              <Link to="/login">Login</Link>
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

export default SignUp;
