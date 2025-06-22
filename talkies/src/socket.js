import { io } from "socket.io-client";

const socket = io("https://talkies-backend.onrender.com", {
  transports: ["polling"],
  upgrade: false,
  withCredentials: true,
});
export default socket;
