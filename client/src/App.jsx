import { Route, Routes } from "react-router-dom"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreatePost from "./pages/CreatePost"
import SinglePost from "./pages/SinglePost"
import EditPost from "./pages/EditPost"
import Profile from "./pages/Profile"

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/" element={<Dashboard/>}></Route>
        <Route path="/create-post" element={<CreatePost/>}></Route>
        <Route path="/post/:slug" element={<SinglePost/>}></Route>
        <Route path="/edit/:slug" element={<EditPost />}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
      </Routes>
    </>
  )
}

export default App
