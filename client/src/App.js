import React, { useEffect, useState } from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@mui/material/styles";
import { io } from "socket.io-client";
import { AuthContext } from "context/authContext";
import { SocketContext } from "context/socketContext";
import useToaster from "hooks/useToaster";
import { muitheme } from "helpers";
import { BASE_URL } from "./constant";
import Login from "pages/Login";
import SignUp from "pages/SignUp";
import Dashboard from "pages/Dashboard";
import NoMatch from "pages/NoMatch";
import { getUserDetails } from "apis/login";
import { ProtectedRoute } from "components";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { showToast } = useToaster();
  const [socket, setsocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const token = sessionStorage.getItem("token");

  const fetchUserDetails = async (token) => {
    try {
      let { data: userData } = await getUserDetails(token);
      setCurrentUser(userData);
    } catch (error) {
      showToast("Something wrong");
    }
  };

  useEffect(() => {
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

  return (
    <>
      <ThemeProvider theme={muitheme}>
        <AuthContext.Provider
          value={{
            currentUser,
            setUserDetails,
          }}
        >
          <SocketContext.Provider
            value={{
              socket,
              onlineUsers,
            }}
          >
            <BrowserRouter>
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
            </BrowserRouter>
            <ToastContainer position="bottom-right" progressStyle={{ background: muitheme?.palette?.primary?.main }} />
          </SocketContext.Provider>
        </AuthContext.Provider>
      </ThemeProvider>
    </>
  );
};

export default App;
