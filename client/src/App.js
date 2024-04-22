import React, { useEffect, useState } from "react";
import Login from "pages/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import NoMatch from "./pages/NoMatch";
import { AuthContext } from "./context/authContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getUserDetails } from "./apis/login";
import useToaster from "hooks/useToaster";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const { showToast } = useToaster();

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
  }, []);

  const setUserDetails = (user) => {
    setCurrentUser(user);
    sessionStorage.setItem("token", user.token);
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#266150",
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthContext.Provider
          value={{
            currentUser,
            setUserDetails,
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
          <ToastContainer position="bottom-right" progressStyle={{ background: theme?.palette?.primary?.main }} />
        </AuthContext.Provider>
      </ThemeProvider>
    </>
  );
};

export default App;
