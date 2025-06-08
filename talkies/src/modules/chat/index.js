import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dft from "../../images/default.jpeg";
import socket from "../../socket";
import {
  IconDotsVertical,
  IconPhone,
  IconSearch,
  IconVideo,
} from "@tabler/icons-react";
import { IconArrowLeft } from "@tabler/icons-react";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Chat = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [currUser, setcurrUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSelected, setnewSelected] = useState(false);
  const [newOptions, setnewOptions] = useState([]);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/userList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
      });
      const data = await response.json();
      setUsers(data.Lists);
      setcurrUser(data.user);
      setLoading(false);
      console.log("currUser", currUser._id);
    };
    fetchUsers();
  }, []);
  const chatRef = useRef(null);

  useEffect(() => {
    const chatBox = chatRef.current;

    const isAtBottom =
      chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 100;

    if (isAtBottom) {
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);
  useEffect(() => {
    if (!selectedUser || !currUser) return;

    socket.emit("add-user", currUser._id);

    socket.emit("load_messages", {
      userId: currUser._id,
      otherUserId: selectedUser._id,
    });

    const handleReceive = (newMsg) => {
      if (
        (newMsg.sender === currUser._id &&
          newMsg.receiver === selectedUser._id) ||
        (newMsg.sender === selectedUser._id && newMsg.receiver === currUser._id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    const handleLoad = (msgs) => {
      setMessages(msgs);
    };

    socket.on("receive-message", handleReceive);
    socket.on("messages_loaded", handleLoad);

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("messages_loaded", handleLoad);
    };
  }, [selectedUser, currUser]);

  const handleNewContact = async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/api/newChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("user:token")}`,
      },
      body: JSON.stringify({ search: search }),
    });
    const res = await response.json();
    setnewOptions(res.UsersAll);
    setnewSelected(true);
    setLoading(false);
  };
  const handleCurrUser = async (user) => {
    setSelectedUser(user);
  };
  const handleSend = async () => {
    if (!msg.trim()) return;

    const msgObj = {
      senderId: currUser._id,
      receiverId: selectedUser._id,
      msg: msg,
    };

    socket.emit("send-message", msgObj);
    setMessages((prev) => [...prev, { ...msgObj, timestamp: Date.now() }]);
    setMsg("");
  };

  return (
    <div
      className={`h-screen flex overflow-hidden justify-center items-center ${
        darkMode ? "bg-[#0a0f27] text-white" : "bg-[#dde3f6]"
      } `}
    >
      <div
        className={`h-[85%] w-[80%] flex bg-opacity-10 bg-white rounded-2xl ${
          darkMode ? "text-white bg-opacity-10" : "bg-opacity-40"
        }`}
      >
        <div
          className={`w-[30%] flex flex-col h-full overflow-scroll scrollbar-hide rounded-l-2xl border-2 ${
            darkMode ? "text-white border-black" : ""
          }`}
        >
          <div
            className={`h-[9%] flex justify-center items-center sticky top-0 shadow-md ${
              darkMode ? " bg-opacity-90 text-white" : ""
            }`}
          >
            <div className="flex justify-center items-center mt-3 w-[80%] h-[90%]">
              <Input
                type="text"
                placeholder="Search"
                value={search}
                className=""
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              ></Input>
            </div>
            <div className="w-[19%] h-[100%] flex justify-center items-center">
              <button
                className="rounded-xl w-[100%] h-[65%] flex items-center justify-center text-white bg-[#8d91f4] hover:bg-[#525197]"
                onClick={() => {
                  handleNewContact();
                }}
              >
                <IconSearch />
              </button>
            </div>
          </div>

          <div className="h-[82%]">
            {newSelected ? (
              newOptions.map((currUser) => {
                return (
                  <div
                    className="flex h-[55px] w-[100%]"
                    onClick={() => {
                      handleCurrUser(currUser);
                    }}
                  >
                    <img
                      src={currUser.profilePic || dft}
                      alt="profile"
                      className="h-[50px] w-[20%] rounded-3xl"
                    ></img>
                    <p className="flex items-center ml-[5px] pl-[5px] w-[80%] ">
                      {currUser.userName}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="justify-center items-center flex w-[82%]">
                No users
              </p>
            )}
          </div>
          <div className="h-[9%]"></div>
          <div>
            <ul className="w-[20px] border-1">
              {
                <div>
                  <img
                    src={dft}
                    alt="Profile"
                    className="w-[6%] h-[80%] mx-2 mt-2 rounded-full"
                  />
                </div>
              }
            </ul>
          </div>
        </div>
        <div
          className={`w-[70%] h-full overflow-scroll scrollbar-hide rounded-r-2xl border-2 ${
            darkMode ? "bg-opacity-90 text-white border-black" : ""
          }`}
        >
          <div
            className={`h-[9%] flex sticky top-0 shadow-md w-full ${
              darkMode ? "bg-opacity-90 text-white" : ""
            }`}
          >
            <div className="mt-5 mx-1">
              {" "}
              <IconArrowLeft />
            </div>

            {selectedUser && (
              <>
                <img
                  src={selectedUser?.profilePic || dft}
                  alt="Profile"
                  className="w-[6%] h-[80%] mx-2 mt-2 rounded-full"
                />
                <p className="flex justify-center items-center">
                  {selectedUser?.userName}
                </p>
              </>
            )}
            <div className="absolute right-0 flex mt-5">
              <IconVideo className="mr-3" />
              <IconPhone className="mr-3" />
              <IconDotsVertical className="mr-3" />
            </div>
          </div>
          <div ref={chatRef} className="h-[82%] w-full color-black">
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  textAlign:
                    m.sender === currUser._id || m.senderId === currUser._id
                      ? "right"
                      : "left",
                }}
              >
                <span>{m.msg}</span>
              </div>
            ))}
          </div>
          <div className="h-[9%] flex align-center justify-center w-[100%]">
            <div className="w-[80%]">
              <Input
                value={msg}
                placeholder="Enter a message"
                className="rounded-xl w-full h-full"
                onChange={(e) => {
                  setMsg(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                style={{ width: "80%", padding: "10px" }}
              />
            </div>
            <div className="w-[19%]">
              <Button
                label="Send"
                className=" rounded-xl mb-4 ml-2 pr-7 bg-[#8d91f4] hover:bg-[#525197] w-[100%]"
                onChange={() => {
                  handleSend();
                }}
              ></Button>
            </div>
            <div className="w-[1%]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
