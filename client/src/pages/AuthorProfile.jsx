import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/NavBar";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const AuthorProfile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Fetch user profile and posts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendURL}/api/users/${userId}`);
        const data = await res.json();
        setUserData(data.user);
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Check follow status after userData is available
  useEffect(() => {
    const checkFollowing = async () => {
      if (!userData?._id) return;
      try {
        const res = await fetch(
          `${backendURL}/api/users/${userData._id}/is-following`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
      }
    };

    checkFollowing();
  }, [userData]);

  // Follow / Unfollow button action
  const handleFollowToggle = async () => {
    try {
      const method = isFollowing ? "DELETE" : "POST";

      const res = await fetch(
        `${backendURL}/api/users/${userData._id}/${isFollowing ? "unfollow" : "follow"}`,
        {
          method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        setIsFollowing(!isFollowing);
      } else {
        console.error("Failed to follow/unfollow");
      }
    } catch (err) {
      console.error("Error during follow/unfollow:", err);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!userData)
    return <div className="text-center mt-10 text-red-500">User not found.</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-0 dark:bg-gray-900 dark:text-white">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          {/* Top Profile Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <img
              src={`https://ui-avatars.com/api/?name=${userData.name}&background=random`}
              alt="Profile"
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-gray-500">
              @{userData.name?.toLowerCase().replace(/\s+/g, "")}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {userData.description || "Blogger & Explorer"}
            </p>
            <button
              onClick={handleFollowToggle}
              className={`mt-3 px-4 py-1 text-sm rounded-full ${
                isFollowing ? "bg-gray-500" : "bg-black"
              } text-white`}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          {/* Post Gallery Section */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Blog Posts</h3>

            {posts.length === 0 ? (
              <p className="text-gray-500">This user hasn't written any posts yet.</p>
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
                      <h4 className="font-semibold text-lg truncate">{post.title}</h4>
                      <p className="text-sm text-gray-500 truncate">
                        {new Date(post.timestamp).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
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

export default AuthorProfile;
