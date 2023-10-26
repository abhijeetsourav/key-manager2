import "./components/signup/signup.css";
import "./App.css";
import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Name from "./components/main/db_test";
import LoadingSign from "./components/loader/loader";
import PrivateRoute from "./routes/privateroute";
import PublicRoute from "./routes/publicroute";

import { AuthContext } from "./components/auth";
import ExternalSignup from "./components/signup/external-signup-doc";
import AdminPanel from "./components/admin/admin-panel";

function App() {
  const currentUser = useContext(AuthContext);
  // const isJavaScriptEnabled = navigator.javaScriptEnabled;

  // if (isJavaScriptEnabled) {
  //   // JavaScript is enabled.
  //   console.log("isJavaScriptEnabled: ", isJavaScriptEnabled);
  // } else {
  //   // JavaScript is disabled.
  //   console.log("js is not enabled");
  // }

  return (
    <BrowserRouter>
      {currentUser === "fetching..." ? (
        <LoadingSign />
      ) : currentUser === "external signup doc upload pending..." ? (
        <ExternalSignup />
      ) : (
        <Routes>
          <Route
            exact
            path="/"
            element={
              <PublicRoute currentUser={currentUser} Component={Login} />
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute currentUser={currentUser} Component={Name} />
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute currentUser={currentUser} Component={AdminPanel} />
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute currentUser={currentUser} Component={Signup} />
            }
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
