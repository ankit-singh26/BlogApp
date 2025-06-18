import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const EditPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', tags: '' });

  useEffect(() => {
    fetch(`${backendURL}/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        const post = data.post;
        setForm({ title: post.title, body: post.body, tags: post.tags || '' });
      });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        alert("Post updated");
        navigate(`/post/${slug}`);
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Post title"
          className="p-2 border rounded"
        />
        <textarea
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Post content"
          rows={10}
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          placeholder="Tags (comma-separated)"
          className="p-2 border rounded"
        />
        <button className="bg-blue-600 text-white py-2 px-4 rounded">Update Post</button>
      </form>
    </div>
  );
};

export default EditPost;
