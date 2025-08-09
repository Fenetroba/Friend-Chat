import React from "react";
import HeroImg from "../assets/hero.jpg";
import { Button } from "./ui/button";
import { FaGoogle } from "react-icons/fa";
import { ChartAreaIcon, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "../lib/Axois";
const Hero = ({isAuth}) => {

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
    <div className="flex flex-col-reverse md:flex-row items-center justify-center min-h-screen bg-[var(--one)] relative overflow-hidden px-4">
      {/* Text Section */}
      <div className="z-10 flex flex-col items-center md:items-start w-full md:w-1/2 mt-8 md:mt-0">
        <div className="font-extrabold text-3xl sm:text-4xl lg:text-5xl text-[var(--four)] uppercase text-center md:text-left">
          HI ! My <span className="text-[var(--two)]">Friend</span> Join Us
        </div>
        <p className="text-[16px] sm:text-lg md:text-xl w-full sm:w-4/5 md:w-full text-center md:text-left text-[var(--five)] bg-[var(--one)] rounded-2xl m-6 md:m-8">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi
          repellendus est expedita eligendi Commodi repellendus est expedita
          eligendi ,
        </p>
        <div className="w-full flex justify-center md:justify-start">
      {
        isAuth ? (
        <Link to='/chat' className="w-full">
            <Button className="w-full px-27 py-3 border-0 bg-[var(--four)]  text-white rounded-2xl mt-2 text-[18px] cursor-pointer hover:bg-[var(--three)] flex items-center justify-center gap-2">
           I Want To Chat <MessageCircle/>
          </Button>
        </Link>
        ) : (
          <Button onClick={handleGoogle}  className="w-full px-6 py-3 border-0 bg-[var(--two)] rounded-2xl mt-2 text-[18px] cursor-pointer hover:bg-[var(--three)] flex items-center justify-center gap-2">
            Continue With Google  <FaGoogle />
          </Button>
        )
      }
        </div>
      </div>
      {/* Image Section */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end mb-8 md:mb-0">
        <img
          src={HeroImg}
          alt="Hero"
          className="w-4/5 max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl h-[400px] rounded-l-full shadow-lg object-cover"
        />
      </div>
    </div>
  );
};

export default Hero;