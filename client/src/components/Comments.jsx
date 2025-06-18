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
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 mt-2 rounded"
          >
            Submit
          </button>
        </form>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="p-4 bg-gray-100 rounded shadow-sm">
            <div className="text-sm text-gray-700 mb-1">
              <strong>{c.user.name}</strong> – {new Date(c.createdAt).toLocaleString()}
            </div>
            <div>{c.text}</div>
            {user?.id === c.user._id && (
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
