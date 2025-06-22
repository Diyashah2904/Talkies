import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  IconBookmark,
  IconHeart,
  IconHome,
  IconMessage,
} from "@tabler/icons-react";
import dft from "../../images/default.jpeg";
import Input from "../../components/Input";

const CommentShow = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [User, setUser] = useState({});
  const [commentOn, setCommentOn] = useState(false);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/allComments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
        }
      );
      const data1 = await response.json();
      console.log(data1);
      setData(data1.posts);
      setUser(data1.user);
    };
    fetchPosts();
  }, []);
  const handleSaves = async (_id, index) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/save`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
          body: JSON.stringify({ id: _id }),
        }
      );
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setData(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnsaves = async (_id, index) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/Unsave`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
          body: JSON.stringify({ id: _id }),
        }
      );
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setData(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleComment = async (_id, index, msg) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/comment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
          body: JSON.stringify({ id: _id, message: msg }),
        }
      );
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setData(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleLike = async (_id, index) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/like`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
          body: JSON.stringify({ id: _id }),
        }
      );
      const updatedPost = await response.json();
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setData(updatePost);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUnlike = async (_id, index) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/unlike`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({ id: _id }),
      }
    );
    const updatedPost = await response.json();
    const updatePost = data?.map((post, i) => {
      if (i === index) return updatedPost;
      else return post;
    });
    setData(updatePost);
  };
  return (
    <div>
      <div className="flex items-center w-[100%] justify-center pb-[7px]">
        <Button
          label={
            <div className="flex">
              <IconHome />
              <p>Home</p>
            </div>
          }
          className="fixed top-2 left-2 bg-[#7684cf] hover:bg-[#4f5ebb] rounded-2xl font-sans text-xl"
          onChange={() => navigate("/")}
        />
        <h1 className="font-bold text-[30px]">Your Commented Posts</h1>
      </div>
      {data?.map(
        (
          {
            _id = "",
            caption = "",
            description = "",
            image = "",
            user = {},
            likes = [],
            comment = [],
            save = [],
            isVideo = false,
          },
          index
        ) => {
          const isAlreadyLiked = likes.length > 0 && likes.includes(User._id);
          return (
            <div className="bg-[#dde3f6] w-[75%] mx-auto mt-20 p-8">
              <div
                className="border-b flex items-center pb-4 mb-4 cursor-pointer"
                onClick={() =>
                  User?.userName === user.userName
                    ? navigate("/profile")
                    : navigate(`/user/${user?.userName}`)
                }
              >
                <div className="flex my-4">
                  <img
                    src={user?.profilePic || dft}
                    alt="Profile"
                    className="w-[13.5%] mx-6 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="mt-4 mb-0 pb-0 text-xl font-bold">
                      {user.userName}
                    </p>
                    <p className="text-xs mb-4 font-semibold">{user.email}</p>
                  </div>
                </div>
              </div>
              <div className="border-b pb-4 mb-4 flex flex-col justify-center items-center h-[75%] mt-9">
                {isVideo ? (
                  <video
                    autoplay
                    controls
                    className="w-[100%] m-0 p-0 rounded-2xl"
                  >
                    <source src={image}></source>
                  </video>
                ) : (
                  <img
                    src={image}
                    alt="Post"
                    className="w-[100%] m-0 p-0 rounded-2xl"
                  />
                )}
                <div className="flex mt-4 mb-2 pb-2 border-b">
                  <h4 className="mr-4 font-bold">{user.email}:</h4>
                  <p className="font-medium">{caption}</p>
                </div>
                <p className="mt-3">{description}</p>
              </div>
              <div className="flex justify-evenly border-b mb-4 pb-3">
                <div
                  className="flex cursor-pointer "
                  onClick={
                    isAlreadyLiked
                      ? () => handleUnlike(_id, index)
                      : () => handleLike(_id, index)
                  }
                >
                  <IconHeart
                    fill={isAlreadyLiked ? "red" : "white"}
                    color={isAlreadyLiked ? "red" : "black"}
                  />
                  <p>{likes?.length}</p>
                </div>
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    setCommentOn(!commentOn);
                  }}
                >
                  <IconMessage />
                  <p>{comment?.length}</p>
                </div>
                <div
                  className="flex cursor-pointer"
                  onClick={() => {
                    save.length > 0 && save.includes(User._id)
                      ? handleUnsaves(_id, index)
                      : handleSaves(_id, index);
                  }}
                >
                  <IconBookmark
                    fill={
                      save.length > 0 && save.includes(User._id)
                        ? "blue"
                        : "white"
                    }
                    color={
                      save.length > 0 && save.includes(User._id)
                        ? "blue"
                        : "black"
                    }
                  />
                  <p>{save?.length}</p>
                </div>
              </div>

              <div id="comment" className={commentOn ? "" : "hidden"}>
                <div id="ipt" className="flex justify-center items-center">
                  <p className="font-semibold">Comment :</p>
                  <Input
                    type="text"
                    value={msg}
                    className="rounded-3xl"
                    onChange={(e) => {
                      setMsg(e.target.value);
                    }}
                  />
                  <Button
                    label="Comment"
                    className="mb-4 ml-4 rounded-3xl mr-20"
                    onChange={() => {
                      handleComment(_id, index, msg);
                    }}
                  ></Button>
                </div>
                <div className="flex flex-col">
                  {comment?.map(({ commentUser = "", msg = "" }) => {
                    return (
                      <div className="flex w-[100%]">
                        <p className="font-semibold">{commentUser} :</p>
                        <p>{msg}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default CommentShow;
