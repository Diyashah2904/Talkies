import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import { IconHome } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const Setting = () => {
  const navigate = useNavigate();
  const [isPrivate, setisPrivate] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://localhost:8000/api/setting", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const user1 = await response.json();
      setisPrivate(user1.user.private);
    };
    fetchUser();
  }, []);
  const makeItPrivate = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/makePrivate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ isPrivate: isPrivate }),
      });
      const user1 = await response.json();
      console.log(user1.user.private);
      setisPrivate(user1?.user.private);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center w-full border-b pb-[7px] h-[15%] ">
        <Button
          label={
            <div className="flex items-center">
              <IconHome />
              <p className="ml-2">Home</p>
            </div>
          }
          className="fixed top-2 left-2 bg-[#8d91f4] hover:bg-[#525197] rounded-2xl font-sans text-xl"
          onChange={() => navigate("/")}
        />
        <h1 className="font-bold text-[30px] font-sans">Settings</h1>
      </div>
      <div>
        {!isPrivate ? (
          <div className="flex justify-center items-center h-screen bg-[#dde3f6]">
            <p className="text-center">
              Your account is public, press the button to make it private
            </p>
            <Button
              label="Private"
              className="mb-4 ml-4 rounded-3xl mr-20 bg-[#8d91f4] hover:bg-[#525197]"
              onChange={() => makeItPrivate()}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen bg-[#dde3f6]">
            <p className="text-center">
              Your account is private, press the button to make it public
            </p>
            <Button
              label="Public"
              className="ml-4 rounded-3xl bg-[#8d91f4] hover:bg-[#525197]"
              onChange={() => makeItPrivate()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
