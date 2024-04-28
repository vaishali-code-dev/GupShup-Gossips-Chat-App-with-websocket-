import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material/styles";
import { io } from "socket.io-client";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import useToaster from "hooks/useToaster";
import { muitheme } from "helpers";
import { BASE_URL, CLIENT_ID } from "./constant";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import Dashboard from "pages/Dashboard";
import NoMatch from "pages/NoMatch";
import { getUserDetails } from "apis/login";
import { ProtectedRoute } from "components";
import { logoutUser } from "apis/login";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { showToast } = useToaster();
  const Navigate = useNavigate();
  const [socket, setsocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchUserDetails = async (token) => {
      try {
        let { data: userData } = await getUserDetails(token);
        setCurrentUser(userData);
      } catch (error) {
        sessionStorage.removeItem("token");
        showToast(error);
      }
    };
    if (token) {
      fetchUserDetails(token);
    }
    setsocket(io(BASE_URL));
  }, []);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("addUser", currentUser._id);
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });
    }
  }, [socket, currentUser]);

  const setUserDetails = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem("token", user.token);
  };

  const logOutUser = async () => {
    try {
      await logoutUser(currentUser._id);
      sessionStorage.removeItem("token");
      Navigate("/");
      showToast("Logout successfully, Hope to see you soon.");
    } catch (error) {
      showToast(error);
    }
  };

  return (
    <>
      <ThemeProvider theme={muitheme}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <AuthContext.Provider
            value={{
              currentUser,
              setUserDetails,
              logOutUser,
            }}
          >
            <SocketContext.Provider
              value={{
                socket,
                onlineUsers,
              }}
            >
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NoMatch />} />
              </Routes>
              <ToastContainer position="bottom-right" progressStyle={{ background: muitheme?.palette?.primary?.main }} />
            </SocketContext.Provider>
          </AuthContext.Provider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
