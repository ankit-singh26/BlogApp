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
    formData.append("tags", tags);
    formData.append("thumbnail", thumbnail);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        // You might want to show a success message here before navigating
        navigate(`/`);
      } else {
        const err = await res.json();
        alert(err.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8"> {/* Added min-h-screen and background */}
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md" data-color-mode="light"> {/* Increased padding, added background, rounded corners, and shadow */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create New Post</h2> {/* Larger title, bolder, darker text, centered */}
          <form onSubmit={handleSubmit} className="space-y-6"> {/* Increased vertical spacing */}
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" // Added more padding, border color, focus styles, and transition
            />

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out" // Same styling as title input
            />

            <div className="border border-gray-300 rounded-md overflow-hidden"> {/* Added border color, rounded corners, and overflow hidden */}
              <MDEditor
                value={body}
                onChange={setBody}
                height={300} // You can adjust the height as needed
              />
            </div>

            <div className="flex items-center space-x-4"> {/* Added flex for alignment and spacing */}
              <label htmlFor="thumbnail-upload" className="block text-sm font-medium text-gray-700">
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
                           hover:file:bg-blue-100 cursor-pointer" // Styled the file input button
              />
            </div>
            {thumbnail && (
              <div className="mt-2 text-sm text-gray-600">
                Selected file: **{thumbnail.name}**
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out" // Full width button, more padding, bolder text, hover and focus styles
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