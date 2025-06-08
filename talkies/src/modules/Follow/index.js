import React, { useEffect, useState } from "react";
import dft from "../../images/default.jpeg";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { IconHome } from "@tabler/icons-react";

const Followers = () => {
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowData = async () => {
      const response = await fetch("http://localhost:8000/api/followShow", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await response.json();
      setFollowerList(data?.followerList);
      setFollowingList(data?.followingList);
    };
    fetchFollowData();
  }, []);

  return (
    <div className="bg-[#dde3f6] flex flex-col items-center">
      <div className="flex items-center w-full justify-center border-b pb-7">
        <Button
          label={
            <div className="flex items-center">
              <IconHome />
              <p className="ml-1">Home</p>
            </div>
          }
          className="fixed top-2 left-2 bg-[#7684cf] hover:bg-[#4f5ebb] rounded-2xl font-sans text-xl"
          onChange={() => navigate("/")}
        />
      </div>

      <div className="w-full md:w-1/2">
        <h2 className="font-bold text-xl mb-4">Followers</h2>
        {followerList.map(({ followerId }) => (
          <div
            key={followerId._id}
            className="flex items-center border-b cursor-pointer"
            onClick={() => navigate(`/user/${followerId.userName}`)}
          >
            <img
              src={followerId.profilePic || dft}
              alt="ProfilePic"
              className="h-10 w-10 rounded-full mr-4"
            />
            <p className="text-lg">{followerId.userName}</p>
          </div>
        ))}
      </div>

      <div className="w-full md:w-1/2">
        <h2 className="font-bold text-xl mb-4">Following</h2>
        {followingList.map(({ followedId }) => (
          <div
            key={followedId._id}
            className="flex items-center border-b cursor-pointer"
            onClick={() => navigate(`/user/${followedId.userName}`)}
          >
            <img
              src={followedId.profilePic || dft}
              alt="ProfilePic"
              className="h-10 w-10 rounded-full mr-4"
            />
            <p className="text-lg">{followedId.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Followers;
