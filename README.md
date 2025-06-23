# 📸 Talkies - Real-Time Instagram Clone (MERN Stack)

**Talkies** is a full-featured real-time Instagram clone built with the MERN stack. It replicates core functionalities of Instagram and WhatsApp, featuring real-time chatting, media sharing (images/videos), personalized feed, user search, private accounts, and much more—all in a clean, interactive UI.

---

## 🌟 Features

### 🔐 User Authentication
- Secure user registration and login
- JWT token stored in local storage
- Protected routes and logout

### 🏠 Home & Feed
- **Home Page**: View your posts and posts from users you follow
- **Feed Section (Left Panel)**: Displays public posts + followed users’ posts

### 👤 Profile
- Access from left panel
- View your own posts
- Change profile picture (Cloudinary)
- View follower/following count
- See total number of posts
- Toggle account between **Public** and **Private**

### 🧭 Left Panel
- **Profile**: Personal profile page
- **Feed**: Aggregated feed from public and followed users
- **Follow Requests**: View and manage incoming follow requests
- **Followers/Following**: Real-time counts displayed
- **Chat**: WhatsApp-style real-time socket-based chat
- **Logout**: Secure logout option

### 🔍 Top Center
- **User Search**: Live search by username
- **Create Post**: Upload images or videos via Cloudinary

### 📦 Media Posting
- Upload image and video content to Cloudinary
- Post immediately shows up in feed/profile
- Interact with posts: Like, Comment, Save
- Click on any post to visit the poster’s profile

### 💬 Real-Time Chat
- Powered by **Socket.IO**
- One-to-one private messaging
- WhatsApp-like UI with real-time updates

### 📥 Right Panel
- **Saved Posts**
- **Liked Posts**
- **Commented Posts**
- **Brand Logo** displayed

---

## 🛠 Tech Stack

### Frontend
- React.js
- Socket.IO Client
- Tailwind CSS / CSS Modules

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (Authentication)
- Cloudinary (Image/Video Uploads)
- Socket.IO Server

---

## 🌐 Cloudinary Integration

- Images and videos are uploaded to **Cloudinary**
- Upload response includes secure URL used for post rendering
- Fast and scalable content delivery

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Talkies.git
cd Talkies
```
### 2. Backend Setup (/server)
```bash
cd server
npm install
```
Create a .env file:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
NEW_PORT = socket_port
```
Start backend:

```bash
npm run dev
```
3. Frontend Setup (/talkies)
```bash
cd ../talkies
npm install
npm start
```
Ensure frontend API calls are configured to your backend server URL/port.

### ✅ Core Functionalities Checklist
#### Feature Status
- JWT Auth (Register/Login/Logout)	✅
- Profile Editing & Picture Upload	✅
- Follower / Following Logic	✅
- Public + Followed Feed	✅
- Real-Time Post Display	✅
- Image/Video Upload (Cloudinary)	✅
- Real-Time Chat (Socket.IO)	✅
- Save / Like / Comment Functionality	✅
- Search Users	✅
- Private Account Toggle	✅
- Chat UI + Live Messaging	✅

📷 Screenshots
Added Soon

🤝 Contribution
Pull requests are welcome. Feel free to fork and submit a PR, or open issues to suggest improvements or report bugs.

📄 License
This project is licensed under the MIT License.

👨‍💻 Developer Info
Project Name: Talkies

Author: Ravij Patel , Diya Shah

GitHub: https://github.com/Ravij-p
        https://github.com/Diyashah2904
