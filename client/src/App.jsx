import { Route, Routes } from "react-router-dom"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<SignUp/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/dashboard" element={<Dashboard/>}></Route>
      </Routes>
    </>
  )
}

export default App
