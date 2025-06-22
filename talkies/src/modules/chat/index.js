import React, { useEffect, useState, useRef } from "react";
import {
  IconDotsVertical,
  IconPhone,
  IconSearch,
  IconVideo,
  IconArrowLeft,
  IconSend,
  IconMoon,
  IconSun,
  IconPlus,
  IconUser,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import socket from "../../socket"; // Uncomment this line to use your actual socket

// Mock components for demonstration
const Input = ({ className, ...props }) => (
  <input
    className={`px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

const Button = ({ label, className, onChange, children, ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${className}`}
    onClick={onChange}
    {...props}
  >
    {children || label}
  </button>
);

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
  const [showUserList, setShowUserList] = useState(true);

  const chatRef = useRef(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/userList`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("user:token")}`,
            },
          }
        );
        const data = await response.json();
        setUsers(data.Lists || []);
        setcurrUser(data.user || {});
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Socket.IO setup for real-time messaging
  useEffect(() => {
    if (!selectedUser?._id || !currUser?._id) return;

    console.log("Setting up socket connection for:", {
      currUser: currUser._id,
      selectedUser: selectedUser._id,
    });

    // Add current user to online users
    socket.emit("add-user", currUser._id);

    // Load existing messages between users
    socket.emit("load_messages", {
      userId: currUser._id,
      otherUserId: selectedUser._id,
    });

    const handleReceiveMessage = (newMsg) => {
      console.log("Received message:", newMsg);
      // Check if message is relevant to current conversation
      if (
        (newMsg.sender === currUser._id &&
          newMsg.receiver === selectedUser._id) ||
        (newMsg.sender === selectedUser._id && newMsg.receiver === currUser._id)
      ) {
        setMessages((prevMessages) => {
          // Avoid duplicate messages
          const messageExists = prevMessages.some(
            (msg) =>
              msg._id === newMsg._id ||
              (msg.timestamp === newMsg.timestamp && msg.msg === newMsg.msg)
          );
          if (!messageExists) {
            return [...prevMessages, newMsg];
          }
          return prevMessages;
        });
      }
    };

    const handleMessagesLoaded = (loadedMessages) => {
      console.log("Messages loaded:", loadedMessages);
      setMessages(loadedMessages || []);
    };

    // Set up socket listeners
    socket.on("receive-message", handleReceiveMessage);
    socket.on("messages_loaded", handleMessagesLoaded);

    // Cleanup listeners on unmount or dependency change
    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("messages_loaded", handleMessagesLoaded);
    };
  }, [selectedUser?._id, currUser?._id]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    const chatBox = chatRef.current;
    if (chatBox) {
      const isAtBottom =
        chatBox.scrollHeight - chatBox.scrollTop <= chatBox.clientHeight + 100;
      if (isAtBottom) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    }
  }, [messages]);

  const handleNewContact = async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/newChat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("user:token")}`,
          },
          body: JSON.stringify({ search: search }),
        }
      );
      const res = await response.json();
      setnewOptions(res.UsersAll || []);
      setnewSelected(true);
    } catch (error) {
      console.error("Error searching users:", error);
      setnewOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCurrUser = async (user) => {
    setSelectedUser(user);
    setShowUserList(false);
    setnewSelected(false);
    setMessages([]); // Clear previous messages
  };

  const handleSend = async () => {
    if (!msg.trim() || !selectedUser?._id || !currUser?._id) return;

    const messageData = {
      senderId: currUser._id,
      receiverId: selectedUser._id,
      msg: msg.trim(),
    };

    console.log("Sending message:", messageData);

    // Send message via socket - your backend will save it and emit back
    socket.emit("send-message", messageData);

    // Clear input immediately for better UX
    setMsg("");

    // Note: Don't add message to state here manually
    // Let the socket "receive-message" event handle it
    // This ensures consistency with backend and handles message persistence
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const UserAvatar = ({ user, size = "md" }) => {
    const sizeClasses = {
      sm: "w-8 h-8",
      md: "w-12 h-12",
      lg: "w-16 h-16",
    };

    return (
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg`}
        >
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm">
              {user?.userName?.charAt(0)?.toUpperCase() || "U"}
            </span>
          )}
        </div>
        {user?.status && (
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
              darkMode ? "border-gray-800" : "border-white"
            } ${getStatusColor(user.status)}`}
          ></div>
        )}
      </div>
    );
  };

  const UserListItem = ({ user, onClick, isSelected = false }) => (
    <div
      className={`flex items-center p-4 cursor-pointer transition-all duration-200 hover:bg-opacity-80 ${
        darkMode
          ? `hover:bg-gray-700 ${isSelected ? "bg-gray-700" : ""}`
          : `hover:bg-gray-100 ${isSelected ? "bg-blue-50" : ""}`
      }`}
      onClick={() => onClick(user)}
    >
      <UserAvatar user={user} />
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p
            className={`font-medium truncate ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {user.userName}
          </p>
          {user.timestamp && (
            <span
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {formatTime(user.timestamp)}
            </span>
          )}
        </div>
        {user.lastMessage && (
          <p
            className={`text-sm truncate mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {user.lastMessage}
          </p>
        )}
      </div>
    </div>
  );

  const MessageBubble = ({ message, isOwn }) => (
    <div className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-md"
            : darkMode
            ? "bg-gray-700 text-white rounded-bl-md"
            : "bg-gray-200 text-gray-800 rounded-bl-md"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.msg}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn
              ? "text-blue-100"
              : darkMode
              ? "text-gray-400"
              : "text-gray-500"
          }`}
        >
          {formatTime(message.timestamp)}
          {message._id && isOwn && (
            <span className="ml-1">
              <IconCheck size={12} className="inline" />
            </span>
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className={`h-screen flex ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Sidebar */}
      <div
        className={`${
          showUserList ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-80 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } border-r`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h1
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Messages
            </h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                {darkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
              </button>
              <button
                onClick={handleNewContact}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                <IconPlus size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <IconSearch
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
              size={20}
            />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={search}
              className={`w-full pl-10 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-gray-50 border-gray-300"
              }`}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div
              className={`p-8 text-center ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : newSelected ? (
            <div>
              <div
                className={`p-4 border-b ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Search Results
                  </h3>
                  <button
                    onClick={() => setnewSelected(false)}
                    className={`p-1 rounded ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <IconX size={16} />
                  </button>
                </div>
              </div>
              {newOptions.length > 0 ? (
                newOptions.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    onClick={handleCurrUser}
                  />
                ))
              ) : (
                <div
                  className={`p-4 text-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <p>No users found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {users.length > 0 ? (
                users
                  .filter(
                    (user) =>
                      !search ||
                      user.userName
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      onClick={handleCurrUser}
                      isSelected={selectedUser?._id === user._id}
                    />
                  ))
              ) : (
                <div
                  className={`p-8 text-center ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <IconUser size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No conversations yet</p>
                  <p className="text-sm mt-1">Start a new chat to get going!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 flex flex-col ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {selectedUser?._id ? (
          <>
            {/* Chat Header */}
            <div
              className={`p-4 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } ${darkMode ? "bg-gray-800" : "bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setShowUserList(true)}
                    className={`md:hidden mr-3 p-2 rounded-lg ${
                      darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <IconArrowLeft size={20} />
                  </button>
                  <UserAvatar user={selectedUser} />
                  <div className="ml-3">
                    <h2
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedUser.userName}
                    </h2>
                    <p
                      className={`text-sm ${
                        selectedUser.status === "online"
                          ? "text-green-500"
                          : darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {selectedUser.status === "online"
                        ? "Online"
                        : "Last seen recently"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <IconVideo size={20} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <IconPhone size={20} />
                  </button>
                  <button
                    className={`p-2 rounded-lg transition-colors ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-300"
                        : "hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <IconDotsVertical size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-1">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <MessageBubble
                    key={message._id || `${message.timestamp}-${index}`}
                    message={message}
                    isOwn={
                      message.sender === currUser._id ||
                      message.senderId === currUser._id
                    }
                  />
                ))
              ) : selectedUser?._id ? (
                <div
                  className={`flex items-center justify-center h-full ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      } flex items-center justify-center`}
                    >
                      <IconUser size={24} />
                    </div>
                    <p>No messages yet</p>
                    <p className="text-sm mt-1">
                      Start the conversation with {selectedUser.userName}!
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="text-center">
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div
              className={`p-4 border-t ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <Input
                    value={msg}
                    placeholder="Type a message..."
                    className={`w-full ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-300"
                    }`}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                </div>
                <Button
                  className={`px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 ${
                    !msg.trim() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onChange={handleSend}
                  disabled={!msg.trim()}
                >
                  <IconSend size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div
            className={`flex-1 flex items-center justify-center ${
              darkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
          >
            <div className="text-center">
              <div
                className={`w-24 h-24 mx-auto mb-6 rounded-full ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                } flex items-center justify-center`}
              >
                <IconUser
                  size={40}
                  className={darkMode ? "text-gray-400" : "text-gray-500"}
                />
              </div>
              <h2
                className={`text-2xl font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome to Chat
              </h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
