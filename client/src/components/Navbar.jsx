import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white border-b px-4 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          📝 BlogApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" className="hover:text-blue-600">Login</Link>
              <Link to="/signup" className="hover:text-blue-600">Signup</Link>
            </>
          ) : (
            <>
              <Link to="/create-post" className="hover:text-blue-600">Create Blog</Link>
              <Link to="/profile" className="hover:text-blue-600">Profile</Link>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col mt-3 gap-4 px-4">
          <Link to="/" onClick={toggleMenu}>Home</Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={toggleMenu}>Login</Link>
              <Link to="/signup" onClick={toggleMenu}>Signup</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={toggleMenu}>Profile</Link>
              <button onClick={handleLogout} className="text-red-500 text-left">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
