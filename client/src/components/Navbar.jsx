import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import { Menu, X } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          📝 BlogApp
        </Link>

        {/* Search Bar */}
        <div className="hidden md:block flex-grow mx-6">
          <input
            type="text"
            placeholder="Search by author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Login</Link>
              <Link to="/signup" className="hover:text-blue-600 dark:hover:text-blue-400">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/create-post" className="hover:text-blue-600 dark:hover:text-blue-400">Create Blog</Link>
              <Link to="/profile" className="hover:text-blue-600 dark:hover:text-blue-400">Profile</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                Logout
              </button>
            </>
          )}
          <DarkModeToggle/>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-700 dark:text-gray-300" onClick={toggleMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Search Bar + Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col mt-3 gap-4 px-4">
          <input
            type="text"
            placeholder="Search by author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          <Link to="/" onClick={toggleMenu}>Home</Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/signup" onClick={toggleMenu}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/create-post" className="hover:text-blue-600 dark:hover:text-blue-400">Create Blog</Link>
              <Link to="/profile" onClick={toggleMenu}>Profile</Link>
              <button onClick={handleLogout} className="text-red-500 text-left">Logout</button>
            </>
          )}
          <DarkModeToggle/>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
