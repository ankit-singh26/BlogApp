import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Comment from '../components/Comment';

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SinglePost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useAuth();

  const handleDelete = async () => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const res = await fetch(`${backendURL}/api/posts/${post.slug}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      alert("Post deleted successfully!");
      navigate("/dashboard"); // redirect to home
    } else {
      const data = await res.json();
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};


  useEffect(() => {
    fetch(`${backendURL}/api/posts/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data.post);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!post) return <div className="text-center mt-10 text-red-500">Post not found.</div>;

  const formattedDate = new Date(post.timestamp).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <img
        src={post.thumbnail}
        alt={post.title}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-4">
        By {post.author.name} • {formattedDate}
      </p>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.body }} />
      {user?.id === post.author._id && (
  <div className="flex gap-4 mb-4">
    <button
      className="bg-blue-500 text-white px-4 py-1 rounded my-3"
      onClick={() => navigate(`/edit/${post.slug}`)}
    >
      Edit
    </button>
    <button
      className="bg-red-500 text-white px-4 py-1 rounded my-3"
      onClick={handleDelete}
    >
      Delete
    </button>
    </div>
    )}
      <Comment postId={post._id} />
    </div>
  );
};

export default SinglePost;
