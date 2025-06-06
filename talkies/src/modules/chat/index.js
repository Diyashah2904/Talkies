import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dft from "../../images/default.jpeg";
import { IconArrowAutofitLeft, IconArrowBadgeLeft, IconDotsVertical, IconPhone, IconPhoneCall, IconPhoneX, IconSearch, IconVideo } from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";
import Input from "../../components/Input";
import Button from "../../components/Button";
const Chat = () => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className={`h-screen flex overflow-hidden justify-center items-center ${darkMode ? "bg-[#0a0f27] text-white" : "bg-[#dde3f6]"}`}>
      <div className={`h-[85%] w-[80%] flex bg-opacity-10 bg-white rounded-2xl ${darkMode ? "text-white bg-opacity-10" : "bg-opacity-40"}`}>
      <div className={`w-[30%] flex flex-col h-full overflow-scroll scrollbar-hide rounded-l-2xl border-2 ${darkMode ? "text-white border-black" : ""}`}>
        <div className={`h-[65px] flex justify-center items-center sticky top-0 shadow-md ${darkMode ? " bg-opacity-90 text-white" : ""}`}>
          <div className="flex justify-center items-center mt-3">
          <IconSearch className="m-2 mb-5"/>
           <Input
           type='text'
           placeholder="Search"></Input>
          </div>
        </div>
        <div>
            <ul className="">
              <li>Diya</li>
              <li>Mahi</li>
            </ul>
          </div>
      </div>
        <div className={`w-[70%] h-full overflow-scroll scrollbar-hide rounded-r-2xl border-2 ${darkMode ? "bg-opacity-90 text-white border-black" : ""}`}>
           <div className={`h-[65px] flex sticky top-0 shadow-md w-full ${darkMode ? "bg-opacity-90 text-white" : ""}`}>
           <div className="mt-5 mx-1"> <IconArrowLeft/></div>
               <img
                  src={dft}
                  alt="Profile"
                  className="w-[6%] h-[80%] mx-2 mt-2 rounded-full"
                />
                <div className="absolute right-0 flex mt-5">
                <IconVideo className="mr-3"/>
                <IconPhone className="mr-3"/>
                <IconDotsVertical className="mr-3"/>
              </div>
           </div>
           <div>
            <ul className="abc"></ul>
           </div>
           <div className="absolute bottom-10 flex">
          <Input 
          type="text"
          placeholder="Enter Your text"
          className="opacity-90 w-[90%]"
         ></Input>
          <Button 
          label="Send"
          className="my-5 bg-[#8d91f4] hover:bg-[#525197] w-full rounded-2xl font-sans text-xl"/>
        </div>
    
        </div>
            </div>
    </div>
  );
};

export default Chat;
