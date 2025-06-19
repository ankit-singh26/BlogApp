import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "../components/NavBar";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const limit = 6;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all unique tags
  const fetchTags = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/tags/all`);
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Error fetching tags:", err);
      // Potentially show a user-friendly error message
    }
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      const tagParam = selectedTag ? `&tag=${selectedTag}` : "";
      const res = await fetch(
        `${BACKEND_URL}/api/posts/all?page=${page}&limit=${limit}${tagParam}`
      );
      
      // Ensure the response is OK before parsing JSON
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.posts.length < limit) setHasMore(false);
      setPosts((prev) => [...prev, ...data.posts]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Fetch error:", err);
      // Potentially show a user-friendly error message
    } finally {
      setIsFetching(false);
    }
  }, [page, selectedTag, hasMore, isFetching, BACKEND_URL, limit]); // Added BACKEND_URL and limit to dependencies

  // Initial load of tags
  useEffect(() => {
    fetchTags();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch posts when tag or page changes
  useEffect(() => {
    // Reset posts and pagination when selectedTag changes to fetch from start
    if (selectedTag !== null) {
      setPosts([]);
      setPage(1);
      setHasMore(true);
    }
    fetchPosts();
  }, [selectedTag, fetchPosts]); // Depend on selectedTag and fetchPosts (which has page as dep)

  // Handle tag click
  const handleTagClick = (tag) => {
    // Only update if the tag is different to avoid unnecessary re-fetches
    if (selectedTag !== tag) {
      setSelectedTag(tag);
      // Resetting pagination states is handled by the useEffect for selectedTag
    }
  };

  const clearFilter = () => {
    if (selectedTag !== null) { // Only clear if a filter is active
      setSelectedTag(null);
      // Resetting pagination states is handled by the useEffect for selectedTag
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8"> {/* Added min-h-screen and background */}
        <div className="max-w-6xl mx-auto p-4 sm:px-6 lg:px-8"> {/* Adjusted padding for responsiveness */}
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800"> {/* Larger, bolder title, darker text */}
            Latest Blog Posts
          </h1>

          {/* Tag Filter Section */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm"> {/* Added background, padding, rounded corners, shadow */}
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Filter by Tag:</h2> {/* Larger heading, darker text */}
            <div className="flex flex-wrap justify-center gap-3"> {/* Increased gap */}
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white shadow-md" // More pronounced active state
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700" // Hover effects
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={clearFilter}
                  className="ml-4 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 ease-in-out" // Styled clear button
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Post List Section */}
          <InfiniteScroll
            dataLength={posts.length}
            next={fetchPosts}
            hasMore={hasMore}
            loader={<h4 className="text-center py-6 text-gray-600 font-medium">Loading more posts...</h4>} 
            endMessage={
              posts.length > 0 ? ( // Only show end message if there are posts
                <p className="text-center text-gray-500 mt-8 text-lg">
                  🎉 You've seen all the posts!
                </p>
              ) : ( // Show a message if no posts match filter
                <p className="text-center text-gray-500 mt-8 text-lg">
                  No posts found for the selected filter.
                </p>
              )
            }
          >
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap, added sm:grid-cols-1 for better mobile */}
              {posts.map((post) => (
                <Link
                  to={`/post/${post.slug}`}
                  key={post._id}
                  className="block bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out" // Added block, shadow-md, overflow-hidden, more pronounced hover effects
                >
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-52 object-cover rounded-t-xl" // Increased height, ensured top corners are rounded
                    />
                  )}
                  <div className="p-5"> {/* Increased padding */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h2> {/* Larger, bolder title, line-clamp */}
                    <p className="text-sm text-gray-500 mb-3 flex items-center"> {/* Aligned icon with text */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="mr-2">{post.author?.name || "Anonymous"}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M12 11h.01M16 11h.01M9 15h.01M13 15h.01M17 15h.01M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                    </p>
                    <p className="text-gray-700 leading-relaxed line-clamp-3"> {/* Increased line-height, line-clamp */}
                      {post.body.replace(/(```[\s\S]*?```)|(`[^`]*?`)|([#*~_`])|(?!\[.*?\]\()(!?\[.*?\]\(.*?\))/g, "").slice(0, 150)}...
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2"> {/* Added flex for tags */}
                      {post.tags && post.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default Dashboard;