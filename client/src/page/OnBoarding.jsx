import PageLoad from "@/components/Animation/PageLoad";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ONBoarding } from "@/Store/AuthSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const OnBoarding = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [onboarding, setOnboarding] = useState({
    Fullname: user?.Fullname || "",
    email: user?.email || "",
    bio: user?.bio || "",
    nativeLanguage: user?.nativeLanguage || "",
    learningLanguage: user?.learningLanguage || "",
    location: user?.location || "",
    password: ""
  });
  const [preview, setPreview] = useState(user?.profilePic || null);

  // Handle profile image upload and preview
 



  const onboardingHandler = async (e) => {
    e.preventDefault();

    const result = await dispatch(ONBoarding(onboarding));

    if (result.payload?.success) {
      toast(result.payload?.message || "Onboarding successful!", {
        style: { background: "#7fe635", color: "#fff" },
      });
      navigate("/");
    } else {
      toast(result.payload?.message || result.error?.message || "Onboarding failed.", {
        style: { background: "#570808", color: "#fff" },
      });
    }
  };

  return (
    <section className="magicpattern min-h-screen flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-lg m-8  bg-gradient-to-br from-[var(--three)] to-[var(--four)] rounded-3xl shadow-2xl p-8 flex flex-col items-center">
        <p className="mb-6 text-gray-500 text-center">Complete your profile to get the best experience.</p>
        <form
          className="w-full flex flex-col gap-5  "
          onSubmit={onboardingHandler}
        >
        

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--two)]">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--two)] outline-none"
              value={onboarding.Fullname}
              onChange={(e) => setOnboarding({ ...onboarding, Fullname: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--two)]">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--two)] outline-none"
              value={onboarding.email}
              onChange={(e) => setOnboarding({ ...onboarding, email: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--two)]">Bio</label>
            <input
              type="text"
              placeholder="Tell us about yourself"
              className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--two)] outline-none"
              value={onboarding.bio}
              onChange={(e) => setOnboarding({ ...onboarding, bio: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-semibold text-[var(--two)]">Native Language</label>
              <input
                type="text"
                placeholder="Native language"
                className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--two)] outline-none"
                value={onboarding.nativeLanguage}
                onChange={(e) => setOnboarding({ ...onboarding, nativeLanguage: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2 w-1/2">
              <label className="font-semibold text-[var(--two)]">Learning Language</label>
              <input
                type="text"
                placeholder="Learning language"
                className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--two)] outline-none"
                value={onboarding.learningLanguage}
                onChange={(e) => setOnboarding({ ...onboarding, learningLanguage: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-[var(--two)]">Location</label>
            <input
              type="text"
              placeholder="Where are you located?"
              className="bg-white px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[var(--two)] outline-none"
              value={onboarding.location}
              onChange={(e) => setOnboarding({ ...onboarding, location: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[var(--two)] to-[var(--three)] text-white font-semibold py-3 rounded-lg hover:from-[var(--three)] hover:to-[var(--two)] transition-all shadow-md mt-4"
          >
            Complete Onboarding
          </Button>
        </form>
      </div>
    </section>
  );
};
export default OnBoarding;
