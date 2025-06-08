import { io } from "socket.io-client";

// Replace with your backend server URL (local or deployed)
const SOCKET_URL = "http://localhost:5000"; // or your deployed backend URL

const socket = io(SOCKET_URL);

export default socket;
