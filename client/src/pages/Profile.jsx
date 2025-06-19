import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [sidebarType, setSidebarType] = useState(null); // 'followers' or 'following'

  const fetchUserPosts = async () => {
    try {
      const res = await fetch(`${backendURL}/api/posts/user/${user.id}`);
      const data = await res.json();
      console.log(data);
      setPosts(data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        const res = await fetch(
          `${backendURL}/api/users/${user.id}/follow-data`
        );
        const data = await res.json();
        setFollowers(data.followers || []);
        setFollowing(data.following || []);
      } catch (err) {
        console.error("Error fetching follow data:", err);
      }
    };

    if (user?.id) {
      fetchUserPosts();
      fetchFollowData();
    }
  }, [user?.id]);

  const openSidebar = (type) => setSidebarType(type);
  const closeSidebar = () => setSidebarType(null);

  const currentList = sidebarType === "followers" ? followers : following;

  return (
    <>
      <Navbar />

      {/* Sidebar Overlay */}
      {sidebarType && (
        <div className="fixed top-13 bg-black bg-opacity-40 z-40 flex justify-end">
          <div className="w-72 sm:w-96 bg-white dark:bg-gray-800 p-6 h-full overflow-y-auto shadow-lg z-50">
            <button
              onClick={closeSidebar}
              className="text-gray-700 dark:text-white text-xl float-right"
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4 dark:text-white mt-6">
              {sidebarType === "followers" ? "Followers" : "Following"}
            </h3>
            <ul className="space-y-2 text-sm">
              {currentList.length === 0 ? (
                <p className="text-gray-500">No {sidebarType} yet.</p>
              ) : (
                currentList.map((user) => (
                  <li key={user._id}>
                    <Link
                      to={`/profile/${user._id}`}
                      className="text-blue-600 hover:underline dark:text-blue-400"
                      onClick={closeSidebar}
                    >
                      {user.name}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white flex justify-center items-center">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          {/* Top Profile Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <img
              src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">
              @{user.name?.toLowerCase().replace(/\s+/g, "")}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {user.description || "Blogger & Dreamer"}
            </p>
          </div>

          {/* Buttons to Toggle Sidebar */}
          <div className="flex gap-8 justify-center mt-4 text-sm text-gray-700 dark:text-gray-300">
            <button
              onClick={() => openSidebar("followers")}
              className="text-center"
            >
              <p className="text-lg font-semibold">{followers.length}</p>
              <p>Followers</p>
            </button>
            <button
              onClick={() => openSidebar("following")}
              className="text-center"
            >
              <p className="text-lg font-semibold">{following.length}</p>
              <p>Following</p>
            </button>
          </div>

          {/* Post Gallery Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-6">Blog Posts</h3>

            {loading ? (
              <p>Loading posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-500">
                You haven't written any posts yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Link
                    to={`/post/${post.slug}`}
                    key={post._id}
                    className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow hover:shadow-md transition"
                  >
                    {post.thumbnail && (
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-40 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="font-semibold text-lg truncate">
                        {post.title}
                      </h4>
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
