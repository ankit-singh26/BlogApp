import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Navbar from "../components/NavBar";
import { useSearch } from "../context/SearchContext";
import DarkModeToggle from "../components/DarkModeToggle";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { searchQuery } = useSearch();
  const limit = 6;
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchTags = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/posts/tags/all`);
      const data = await res.json();
      setTags(data);
    } catch (err) {
      console.error("Error fetching tags:", err);
    }
  };

  const fetchPosts = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      const tagParam = selectedTag ? `&tag=${selectedTag}` : "";
      const res = await fetch(
        `${BACKEND_URL}/api/posts/all?page=${page}&limit=${limit}${tagParam}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.posts.length < limit) setHasMore(false);
      setPosts((prev) => [...prev, ...data.posts]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsFetching(false);
    }
  }, [page, selectedTag, hasMore, isFetching]);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [selectedTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTagClick = (tag) => {
    if (selectedTag !== tag) setSelectedTag(tag);
  };

  const clearFilter = () => {
    if (selectedTag !== null) setSelectedTag(null);
  };

  const filteredPosts = posts.filter((post) =>
    post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100  dark:bg-gray-900 dark:text-white py-8">
        <div className="max-w-6xl mx-auto p-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
            Latest Blog Posts
          </h1>

          {/* Tag Filter Section */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Filter by Tag:</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ease-in-out ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
              {selectedTag && (
                <button
                  onClick={clearFilter}
                  className="ml-4 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-full hover:bg-red-50"
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
            loader={
              <h4 className="text-center py-6 text-gray-600 font-medium">
                Loading more posts...
              </h4>
            }
            endMessage={
              filteredPosts.length > 0 ? (
                <p className="text-center text-gray-500 mt-8 text-lg">
                  🎉 You've seen all the posts!
                </p>
              ) : (
                <p className="text-center text-gray-500 mt-8 text-lg">
                  No posts found for the selected filter or search.
                </p>
              )
            }
          >
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link
                  to={`/post/${post.slug}`}
                  key={post._id}
                  className="block bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  {post.thumbnail && (
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full h-52 object-cover rounded-t-xl"
                    />
                  )}
                  <div className="p-5">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">
                      {post.author?.name || "Anonymous"} |{" "}
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                      {post.body.replace(/[`#*_~]/g, "").slice(0, 150)}...
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                        >
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
