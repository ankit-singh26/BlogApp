import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`${backendURL}/api/posts/user/${user.id}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUserPosts();
  }, [user?.id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl p-8">
          {/* Top Profile Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">@{user.name?.toLowerCase().replace(/\s+/g, "")}</p>
            <p className="text-sm text-gray-400 mt-1">{user.description || "Blogger & Dreamer"}</p>
            <button className="mt-3 px-4 py-1 text-sm bg-black text-white rounded-full">
              Follow
            </button>
          </div>

          {/* Post Gallery Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Blog Posts</h3>

            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">You haven't written any posts yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    to={`/post/${post.slug}`}
                    key={post._id}
                    className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md transition"
                  >
                    {post.thumbnail && (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-lg truncate">{post.title}</h4>
                      <p className="text-sm text-gray-500 truncate">
                        by {post.author?.name || "Anonymous"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
