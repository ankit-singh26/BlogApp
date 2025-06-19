import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Comment from "../components/Comment";
import Navbar from "../components/NavBar";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SinglePost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch post details
  useEffect(() => {
    fetch(`${backendURL}/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        const p = data.post;
        setPost(p);
        setLikesCount(p.likes || 0);
        setLiked(p.likedBy?.includes(user?.id));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [slug, user?.id]);

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
        navigate("/");
      } else {
        const data = await res.json();
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleLikeToggle = async () => {
    try {
      const res = await fetch(`${backendURL}/api/posts/${post._id}/like`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();

      setLiked(!liked);
      setLikesCount(data.likes);
    } catch (err) {
      console.error("Like toggle error:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!post)
    return (
      <div className="text-center mt-10 text-red-500">Post not found.</div>
    );

  const formattedDate = new Date(post.timestamp).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10 dark:bg-gray-900 dark:text-white">
        {post.thumbnail && (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          By{" "}
          <Link
            to={`/profile/${post.author._id}`}
            className="text-blue-500 hover:underline"
          >
            {post.author.name}
          </Link>{" "}
          • {formattedDate}
        </p>

        {/* Like Button */}
        <div className="mb-4 flex items-center gap-2">
          <button
            className={`text-xl ${
              liked ? "text-red-600" : "text-gray-400"
            } hover:scale-110 transition-all`}
            onClick={handleLikeToggle}
          >
            {liked ? "❤️" : "🤍"}
          </button>
          <span className="text-sm text-gray-600">
            {likesCount} like{likesCount !== 1 && "s"}
          </span>
        </div>

        <div
          className="prose max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Edit/Delete Buttons */}
        {(user?.id === post.author._id || user?.isAdmin) && (
          <div className="flex gap-4 mb-4">
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => navigate(`/edit/${post.slug}`)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}

        {/* Comments */}
        <Comment postId={post._id} />
      </div>
    </>
  );
};

export default SinglePost;
