import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconBookmark,
  IconHeart,
  IconHome,
  IconMessage,
} from "@tabler/icons-react";
import dft from "../../images/default.jpeg";
import Input from "../../components/Input";
import Button from "../../components/Button";
const Profile = () => {
  const [data, setdata] = useState({
    profilePic: "",
  });
  const navigate = useNavigate();
  const [pic, setpic] = useState("");
  const [url, seturl] = useState("");
  const [posts, setposts] = useState([]);
  const [User, setUser] = useState([]);
  useEffect(() => {
    const getPosts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/profile`,
        {
          method: "GET",
          headers: {
            "content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
        }
      );
      const data = await response.json();
      setposts(data?.posts);
      setUser(data?.user);
    };
    getPosts();
  }, []);
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", data.profilePic);
    formData.append("upload_preset", "talkies");
    formData.append("cloud_name", "dxnbifyht");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dxnbifyht/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      return await res.json();
    } else return "Error";
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { secure_url } = await uploadImage();
      seturl(secure_url);
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/profilePic`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
          body: JSON.stringify({
            url: url,
          }),
        }
      );
      const { profilePic } = await response.json();
      setpic(profilePic);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div className="flex items-center w-[100%] justify-center pb-[7px] mt-5">
        <Button
          label={
            <div className="flex">
              <IconHome />
              <p>Home</p>
            </div>
          }
          className="fixed top-2 left-2 bg-[#7684cf] hover:bg-[#4f5ebb] rounded-2xl font-sans text-xl mt-5"
          onChange={() => navigate("/")}
        />
        <h1 className="font-bold font-sans text-[30px]">Profile</h1>
      </div>
      <div className="flex justify-center items-center bg-[#dde3f6]">
        <div className="border flex flex-col justify-center items-center p-10">
          <div className="flex flex-col justify-center items-center my-[6px]">
            <form onSubmit={(e) => handleSubmit(e)}>
              <div className="flex flex-col my-4 items-center">
                <img
                  src={pic || dft}
                  alt="Profile"
                  className="w-[120px] h-[120px] mx-6 rounded-full"
                />
                <div className="flex flex-col items-center mt-[7px]">
                  <p className="text-xl font-sans font-bold">
                    {User?.userName}
                  </p>
                  <p className="text-xs font-sans font-semibold">
                    {User?.email}
                  </p>
                </div>
              </div>
              <Input
                type="file"
                name="image"
                className="py-4 hidden"
                onChange={(e) =>
                  setdata({ ...data, profilePic: e.target.files[0] })
                }
                isRequired={false}
              />
              <label
                htmlFor="image"
                className="cursor-pointer border shadow w-full p-[8.25px] mr-[15px] rounded-2xl bg-[#7684cf] hover:bg-[#4f5ebb] font-sans text-xl text-white font-bold"
              >
                {data?.img?.name || "Upload Image"}
              </label>
              <Button
                label="Add Profile Pic"
                type="submit"
                className="mt-6 rounded-2xl rounded-2xl bg-[#7684cf] hover:bg-[#4f5ebb] font-sans text-xl"
              />
            </form>
          </div>
          <div className="rounded-lg bg-[#dde3f6] grid grid-cols-3 gap-4 w-40% m-4">
            {posts?.length > 0 &&
              posts?.map(
                ({
                  _id,
                  caption = "",
                  description = "",
                  image = "",
                  likes = [],
                  comment = [],
                  save = [],
                  isVideo = false,
                }) => {
                  return (
                    <div className="w-[500px] p-6 border rounded-lg mt-6 flex flex-col">
                      <div className="pb-4 mb-4 flex flex-col justify-center">
                        {isVideo ? (
                          <video
                            controls
                            className="w-[100%] m-0 p-0 rounded-2xl"
                          >
                            <source src={image} type="video/mp4"></source>
                          </video>
                        ) : (
                          <img
                            src={image}
                            alt="Post"
                            className="w-[100%] m-0 p-0 rounded-2xl"
                          />
                        )}
                        <div>
                          <p className="my-3 text-md font-semibold">
                            {caption}
                          </p>
                        </div>
                        <p>{description}</p>
                      </div>
                      <div className="flex justify-evenly">
                        <div className="flex">
                          <IconHeart
                            fill={likes.includes(User._id) ? "red" : "white"}
                            color={likes.includes(User._id) ? "red" : "black"}
                          />
                          <p>{likes.length}</p>
                        </div>
                        <div className="flex">
                          <IconMessage />
                          <p>{comment.length}</p>
                        </div>
                        <div className="flex">
                          <IconBookmark
                            fill={save.includes(User._id) ? "blue" : "white"}
                            color={save.includes(User._id) ? "blue" : "black"}
                          />
                          <p>{save.length}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
