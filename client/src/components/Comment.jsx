import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const backend = import.meta.env.VITE_BACKEND_URL;

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    const res = await fetch(`${backend}/api/comments/${postId}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in or sign up to post a comment.");
      return;
    }
    if (!text.trim()) return;

    const res = await fetch(`${backend}/api/comments/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    setText("");
    setComments([data, ...comments]);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Delete this comment?");
    if (!confirmDelete) return;

    await fetch(`${backend}/api/comments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    setComments(comments.filter((c) => c._id !== id));
  };

  return (
    <div className="mt-10 dark:bg-gray-900 dark:text-black py-8">
      <h3 className="text-xl font-semibold mb-4 dark:text-white">Comments</h3>

      <form onSubmit={handleSubmit} className="mb-4 dark:text-white">
        <textarea
          className="w-full p-2 border rounded dark:text-white"
          placeholder={
            user ? "Write a comment..." : "Login or Sign up to comment"
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => {
            if (!user) {
              alert("Please log in or sign up to post a comment.");
            }
          }}
          readOnly={!user}
        />

        <button
          type="submit"
          className={`px-4 py-2 mt-2 rounded text-white ${
            user ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!user}
        >
          Submit
        </button>
      </form>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="p-4 bg-gray-100 rounded shadow-sm">
            <div className="text-sm text-gray-700 mb-1">
              <strong>{c.user?.name || "Unknown User"}</strong> –{" "}
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div>{c.text}</div>
            {user?.id === c.user?._id && (
              <button
                onClick={() => handleDelete(c._id)}
                className="text-sm text-red-500 mt-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
