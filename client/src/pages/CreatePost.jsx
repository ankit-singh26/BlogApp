import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('**Start writing your post...**');
  const [thumbnail, setThumbnail] = useState(null);
  const navigate = useNavigate();
  const { userToken } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !body || !tags || !thumbnail) {
      return alert("Please fill in all fields");
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('tags', tags);
    formData.append('thumbnail', thumbnail);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/dashboard`);
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
    <div className="max-w-3xl mx-auto p-4" data-color-mode="light">
      <h2 className="text-2xl font-bold mb-4">Create New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div className="border rounded p-2 bg-white">
          <MDEditor value={body} onChange={setBody} />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setThumbnail(e.target.files[0])}
          className="w-full"
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
