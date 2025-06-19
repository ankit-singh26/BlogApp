import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const limit = 6;

  // Reset state on mount
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, []);

  const fetchPosts = useCallback(async () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/posts/all?page=${page}&limit=${limit}`
      );
      const data = await res.json();

      if (data.posts.length < limit) setHasMore(false);
      setPosts(prev => [...prev, ...data.posts]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsFetching(false);
    }
  }, [page, hasMore, isFetching]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blog Posts</h1>
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchPosts}
        hasMore={hasMore}
        loader={<h4 className="text-center py-4">Loading more...</h4>}
        endMessage={
          <p className="text-center text-gray-500 mt-4">🎉 You've seen it all!</p>
        }
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link
              to={`/post/${post.slug}`}
              key={post._id}
              className="bg-white shadow rounded-xl hover:shadow-lg transition-all duration-300"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  by {post.author?.name || "Anonymous"} •{" "}
                  {new Date(post.timestamp).toLocaleDateString()}
                </p>
                <p className="text-gray-700 line-clamp-3">
                  {post.body.replace(/[#>*_]/g, "").slice(0, 120)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Dashboard;
