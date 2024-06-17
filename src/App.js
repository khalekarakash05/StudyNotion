import "./App.css";
import {Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";
import Contact from "./pages/Contact";
// import MyProfile from "./pages/MyProfile";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import Error from "./pages/Error"


function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home></Home>}></Route>

        <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
    <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

    <Route 
    path="forgot-password"
    element={
      <OpenRoute>
        <ForgotPassword/>
      </OpenRoute>
    }></Route>

    <Route 
        path="verify-email"
        element={
          <OpenRoute>
            <VerifyEmail/>
          </OpenRoute>
    }></Route>

        <Route 
          path="update-password/:id"
          element={
            <OpenRoute>
              <UpdatePassword/>
            </OpenRoute>
          }></Route>

          <Route
            path="about"
            element={
              <About></About>
            }
          ></Route>

          <Route path="contact" element={<Contact></Contact>}></Route>

          <Route 
          element={
            <PrivateRoute>
              <Dashboard></Dashboard>
            </PrivateRoute>
          }
          >

          <Route path="dashboard/my-profile"
          element = {<MyProfile></MyProfile>}>

          </Route>

          </Route>

          

          <Route path="*" element={<Error></Error>}></Route>
    
      </Routes> 
    </div>
  );
}

export default App;
