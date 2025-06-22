import React, { useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
const CreatePost = () => {
  const [data, setData] = useState({
    caption: "",
    desc: "",
    img: "",
  });
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", data.img);
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
    e.preventDefault();
    const { secure_url } = await uploadImage();
    setUrl(secure_url);
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}api/new-post`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("user:token")}`,
        },
        body: JSON.stringify({
          caption: data.caption,
          desc: data.desc,
          url: url,
          userId: "65f47bd5c81a4a8a1f7507e4",
          isVideo: data.img.type.includes("video") ? true : false,
        }),
      }
    );
    if (response.status === 200) {
      navigate("/");
    } else {
      console.log("error");
    }
  };
  return (
    <div className="flex bg-[#dde3f6] justify-center items-center h-screen">
      <div className="w-[800px] h-[600px] p-6">
        <form onSubmit={(e) => handleSubmit(e)}>
          <h1 className="text-2xl pb-4 font-bold text-[#4f5ebb]">
            Create Post
          </h1>
          <Input
            placeholder="Captions..."
            name="title"
            className="py-4 rounded-2xl"
            value={data.caption}
            onChange={(e) => setData({ ...data, caption: e.target.value })}
          />
          <textarea
            rows={10}
            className="w-full border shadow py-4 px-4 resize-none rounded-2xl"
            placeholder="Description"
            value={data.desc}
            onChange={(e) => setData({ ...data, desc: e.target.value })}
          />
          <Input
            type="file"
            name="image"
            className="py-4 hidden"
            onChange={(e) => setData({ ...data, img: e.target.files[0] })}
            isRequired={false}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-white p-4 border shadow w-full rounded-2xl"
          >
            {data?.img?.name || "Upload Image"}
          </label>
          <Button
            label="Create post"
            type="submit"
            className="my-5 w-full bg-[#7684cf] hover:bg-[#4f5ebb] rounded-2xl font-sans text-xl"
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
