import { Route, Routes } from "react-router-dom"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreatePost from "./pages/CreatePost"
import SinglePost from "./pages/SinglePost"
import EditPost from "./pages/EditPost"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
        <Route path="/create-post" element={<CreatePost/>}></Route>
        <Route path="/post/:slug" element={<SinglePost/>}></Route>
        <Route path="/edit/:slug" element={<EditPost />} />
      </Routes>
    </>
  )
}

export default App
