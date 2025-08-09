import { UpdateProfile } from '@/Store/AuthSlice';
import { Camera } from 'lucide-react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const Setting = ({user}) => {
  const navigate=useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result); // This will be base64 string
      };
      reader.readAsDataURL(file);
    }
  };
const dispatch =useDispatch()
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      profilePic: profilePic 
    };
    
    dispatch(UpdateProfile(userData)).then((result) => {
      if (result.payload?.success || result.meta?.requestStatus === "fulfilled") {
       
        toast(result.payload?.message || "update Succsess full ", {
          style: { background: "#7fe635", color: "#fff" },
        });
        navigate("/chat");
      } else {
        toast(result.payload?.message || "Registration attempted", {
          style: { background: "#570808", color: "#fff" },
        });
      }
    });
  };

  return (
    <section>
     
      <div className="magicpattern h-[100vh] backdrop-blur-lg  flex justify-center items-center min-h-[80vh] ">
    
    <form onSubmit={handleSubmit} className=" m-4 bg-gradient-to-br from-[var(--three)] to-[var(--four)] p-8 rounded-2xl text-white shadow-2xl w-full max-w-md border border-gray-200">
      
      <div className="flex flex-col items-center mb-6 backdrop-blur-lg ">
        <label htmlFor="profilePic" className="cursor-pointer">
          <div className=" w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
           <img src={user.profilePic} alt="" />
            {preview ? (
              <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
            
                <Camera/>
              
           
            )}
          </div>
          <input
            id="profilePic"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
    
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-[var(--two)] to-[var(--three)] text-white font-semibold py-3 rounded-lg hover:from-[var(--three)] hover:to-[var(--two)] transition-all shadow-md"
      >
        Save Changes
      </button>
    </form>
  </div>
    </section>
  );
};

export default Setting;