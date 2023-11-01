import "./components/signup/signup.css";
import "./App.css";
import React, {
  useContext,
  useRef,
  useState,
  useEffect,
  useNavigate,
} from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Name from "./components/main/db_test";
import LoadingSign from "./components/loader/loader";
// import PrivateRoute from "./routes/privateroute";
// import PublicRoute from "./routes/publicroute";

import { AuthContext } from "./components/auth";
import AdminPanel from "./components/admin/admin-panel";

function App() {
  const currentUser = useContext(AuthContext);
  const docIn = useRef(null);
  console.log(currentUser);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const func0 = () => {
      if (
        ![
          "App access pending...",
          "App access declined...",
          "Email verification pending in signup...",
          "Email verification pending...",
          "null",
          "fetching...",
        ].includes(currentUser)
      ) {
        console.log(`What is current user status: ${currentUser}`);
        const adminDocRef = doc(db, "admin-users", currentUser.id);
        getDoc(adminDocRef).then((adminDoc) => {
          //checking whether the user is admin or not
          if (adminDoc.exists()) {
            setUserIsAdmin(true);
          } else {
            setUserIsAdmin(false);
          }
        });
      }

      if (currentUser === "Email verification pending...") {
        const func1 = async () => {
          const adminUserDocRef = doc(db, "admin", auth.currentUser.uid);
          const adminUserDoc = await getDoc(adminUserDocRef);
          if (adminUserDoc.data()) {
            docIn.current = "admin";
          } else {
            docIn.current = "nowhere";
          }
        };
        func1();
      }
    };
    func0();
  }, []);

  const getComponentToRenderLogin = () => {
    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      console.log("login");
      return <Login />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      return <Navigate to="/home" />;
    }
  };
  const getComponentToRenderSignup = () => {
    // switch (currentUser) {
    //   case "null" || "Email verification pending in signup...":
    //     return <Signup />;
    //   case "App access pending..." ||
    //     "App access declined..." ||
    //     "Email verification pending...":
    //     return <Navigate to="/" />;
    //   default:
    //     return <Navigate to="/home" />;
    // }
    if (
      currentUser === "null" ||
      currentUser === "Email verification pending in signup..."
    ) {
      return <Signup />;
    } else if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..."
    ) {
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/home" />;
    }
  };
  const getComponentToRenderAdmin = () => {
    // switch (currentUser) {
    //   case "App access pending..." ||
    //     "App access declined..." ||
    //     "Email verification pending..." ||
    //     "null":
    //     return <Navigate to="/" />;
    //   case "Email verification pending in signup...":
    //     return <Navigate to="/signup" />;
    //   default:
    //     if (userIsAdmin) {
    //       return <AdminPanel />;
    //     } else {
    //       return <Navigate to="/home" />;
    //     }
    //   //     userIsAdmin ? (return <AdminPanel />) :
    //   //     (return <Navigate to="/home" />)
    // }
    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      return <Navigate to="/" />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      if (userIsAdmin) {
        return <AdminPanel />;
      } else {
        return <Navigate to="/home" />;
      }
    }
  };
  const getComponentToRenderHome = () => {
    // switch (currentUser) {
    //   case "App access pending..." ||
    //     "App access declined..." ||
    //     "Email verification pending..." ||
    //     "null":
    //     return <Navigate to="/" />;
    //   case "Email verification pending in signup...":
    //     return <Navigate to="/signup" />;
    //   default:
    //     return <Name />;
    // }

    if (
      currentUser === "App access pending..." ||
      currentUser === "App access declined..." ||
      currentUser === "Email verification pending..." ||
      currentUser === "null"
    ) {
      console.log("home");
      return <Navigate to="/" />;
    } else if (currentUser === "Email verification pending in signup...") {
      return <Navigate to="/signup" />;
    } else {
      return <Name />;
    }
  };

  return (
    <BrowserRouter>
      {currentUser === "fetching..." ? (
        <LoadingSign />
      ) : (
        <Routes>
          <Route exact path="/" element={getComponentToRenderLogin()} />
          <Route path="/signup" element={getComponentToRenderSignup()} />
          <Route path="/admin" element={getComponentToRenderAdmin()} />
          <Route path="/home" element={getComponentToRenderHome()} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;

/* 
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
        */
