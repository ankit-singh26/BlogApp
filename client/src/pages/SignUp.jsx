import { useState } from "react";
import { useNavigate } from "react-router-dom"

const backendURL = import.meta.env.VITE_BACKEND_URL;

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email:"",
        password:"",
        phoneNumber:"",
        isAdmin: false
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${backendURL}/api/register`, {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(formData)
            })
            if(!res){
                const errorData = await res.json();
                alert("Sign up failed: " + (errorData.message || "Unknown error"));
                return;
            }
            alert("Sign up successful!");
            navigate("/login");
        }catch(err){
            console.log(err)
            alert("Sign up failed. Please try again.");
        }
    }
    return (
        <>
        <div>
            <form
            onSubmit={handleSignUp}
            aria-label="Sign up form"
            >
                <h2>Sign up</h2>
                <input
                type="name"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                />
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                />
                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                />
                <input
                type="phoneNumber"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                />
                <input
                type="isAdmin"
                name="isAdmin"
                placeholder="isAdmin"
                value={formData.isAdmin}
                onChange={handleChange}
                />
                <input
                type="submit"
                value="Sign up"
                />
            </form>
        </div>
        </>
    )
}

export default SignUp