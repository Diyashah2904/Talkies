import { io } from "socket.io-client";

const socket = io("https://talkies-backend.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
export default socket;
