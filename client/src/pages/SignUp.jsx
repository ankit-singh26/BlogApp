import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    password: "",
    phoneNumber: "",
    isAdmin: false, // Consider if isAdmin should be a user-editable field on sign-up
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber) {
      alert("Please fill in all required fields (Name, Email, Password, Phone Number).");
      return;
    }

    try {
      const res = await fetch(`${backendURL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // It's good practice to check res.ok for successful HTTP status codes (200-299)
      if (!res.ok) {
        const errorData = await res.json();
        alert("Sign up failed: " + (errorData.message || "Unknown error"));
        return;
      }

      alert("Sign up successful! Please log in."); // More informative message
      navigate("/login");
    } catch (err) {
      console.error("Sign up error:", err); // Use console.error for errors
      alert("Sign up failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  dark:bg-gray-900 dark:text-white">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create Your Account
          </h2>
          <form onSubmit={handleSignUp} className="mt-8 space-y-6" aria-label="Sign up form">
            <div>
              <input
                type="text" // Changed from "name" to "text" as type for HTML input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required // Added required attribute for client-side validation
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <textarea // Changed to textarea for description for better user experience
                name="description"
                placeholder="Tell us about yourself (optional)"
                value={formData.description}
                onChange={handleChange}
                rows="3" // Specifies visible number of lines
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <input
                type="tel" // Use "tel" for phone numbers
                name="phoneNumber"
                placeholder="Phone Number (e.g., 123-456-7890)"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>
            {/* Consider if isAdmin should be a selectable option for regular users */}
            {/* If not, remove this input or set it based on backend logic */}
            <div className="flex items-center">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                checked={formData.isAdmin}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">
                Register as Admin (usually only for development/internal use)
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;