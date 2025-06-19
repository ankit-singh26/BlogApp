import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import MDEditor from "@uiw/react-md-editor"; // Import MDEditor for consistent editing
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", body: "", tags: "" });
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await fetch(`${backendURL}/api/posts/${slug}`);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        const post = data.post;
        setForm({
          title: post.title,
          body: post.body,
          tags: (Array.isArray(post.tags) ? post.tags.join(", ") : post.tags) || "", // Handle tags array or string
        });
      } catch (err) {
        console.error("Error fetching post for editing:", err);
        setError("Failed to load post. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPostData();
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.body || !form.tags) {
      alert("Please fill in all fields (Title, Body, and Tags).");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/posts/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert("Post updated successfully!");
        navigate(`/post/${slug}`);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update post.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating post. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100  dark:bg-gray-900 dark:text-white">
          <p className="text-xl text-gray-700">Loading post data...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4  dark:bg-gray-900 dark:text-white">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out"
          >
            Go to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-0">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md" data-color-mode="light">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Edit Your Post
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post Title"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
            <div className="border border-gray-300 rounded-md overflow-hidden">
                <MDEditor
                    value={form.body}
                    onChange={(value) => setForm({ ...form, body: value })}
                    height={300} // Consistent height with CreatePost
                />
            </div>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="Tags (comma-separated, e.g., react, javascript)"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Update Post
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;