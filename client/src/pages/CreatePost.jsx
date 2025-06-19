import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import Navbar from "../components/NavBar";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [body, setBody] = useState("**Start writing your post...**");
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body || !tags || !thumbnail) {
      return alert("Please fill in all fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);

    // ✅ Send tags as a JSON array
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(tagArray));

    formData.append("thumbnail", thumbnail);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`, // ✅ Pass token in headers
          },
          body: formData, // ✅ No 'Content-Type' header when using FormData
        }
      );

      if (res.ok) {
        navigate(`/`);
      } else {
        // Don't try to parse JSON if it's not actually JSON!
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const err = await res.json();
          alert(err.message || "Something went wrong");
        } else {
          const text = await res.text(); // fallback to plain text
          console.error("Non-JSON error:", text);
          alert("Something went wrong on the server.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100  dark:bg-gray-900 dark:text-white py-8">
        <div
          className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md"
          data-color-mode="light"
        >
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Create New Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            />

            <div className="border border-gray-300 rounded-md overflow-hidden">
              <MDEditor value={body} onChange={setBody} height={300} />
            </div>

            <div className="flex items-center space-x-4">
              <label
                htmlFor="thumbnail-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Post Thumbnail:
              </label>
              <input
                id="thumbnail-upload"
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            {thumbnail && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: <strong>{thumbnail.name}</strong>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Publish Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
