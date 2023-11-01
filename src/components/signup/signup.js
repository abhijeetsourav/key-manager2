import React, { useState, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { Link } from "react-router-dom";

import key from "./key.png";
import logo from "./cyborg-logo.png";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { db, auth, googleProvider } from "../../firebase";
import LoadingSign from "../loader/loader";
import "./signup.css";
import toast from "react-hot-toast";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const phone = useRef("");
  const [errorMessage, setErrorMessage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    toast("Creating a user...");
    const createUser = createUserWithEmailAndPassword(auth, email, password)
      .then(async (cred) => {
        toast.dismiss();
        toast.success("User has been created.");
        try {
          await toast.promise(
            setDoc(doc(db, "admin", cred.user.uid), {
              name: username,
              haskey: false,
              email: email,
              phone: phone.current,
            }),
            {
              loading: "adding document",
              success: "document added successfully",
              error: (error) => {
                toast.dismiss();
                return error.code;
              },
            }
          );
          await toast.promise(
            Promise.all([
              sendEmailVerification(auth.currentUser),
              signOut(auth),
            ]),
            {
              loading: "sending mail...",
              success:
                "An email has been sent, please verify to continue the sign up process",
              error: (error) => {
                toast.dismiss();
                return error.code;
              },
            }
          );
          const inputBoxes = document.querySelectorAll(".input-field");
          for (let inputBox of inputBoxes) {
            inputBox.value = "";
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        toast.dismiss();
        toast.error(error.code);
      });

    // await uploadingDoc();

    /*toast.promise(uploadingDoc, {
            loading: "uploading doc to firebase database...",
            success: "Doc uploaded successfully",
            error: (error) => {
              toast.dismiss();
              switch (error.code) {
                case "permission-denied":
                  return "Permission Denied: Check Firestore Security Rules";
                case "unavailable":
                  return "Network Error: Check your internet connection";
                case "invalid-argument":
                  return "Invalid Data Format: Check your data format";
                case "already-exists":
                  return "Document Already Exists: Use a unique document ID";
                case "resource-exhausted":
                  return "Rate Limit Exceeded: Implement rate limiting";
                case "unauthenticated":
                  return "Authentication Error: User is not authenticated";
                case "quota-exceeded":
                  return "Quota Exceeded: Check your Firebase billing and quotas";
                default:
                  return "An unknown error occurred: ", error;
              }
            },
          }); */

    // await verifyEmail();
    /*toast.promise(verifyEmail, {
            loading: "Wait for a moment",
            success:
              "A verification email has been sent to your mail id , verify your mail within 1 hour to access the app",
            error: (error) => {
              return error;
            },
          });*/
    // createUser();
    /*toast.promise(createUser, {
      loading: "creating user.....",
      success: "a user has been created",
      error: (error) => {
        return `error in creating user: ${error}`;
      },
    });*/

    /*try {
      await toast.promise(
        createUserWithEmailAndPassword(auth, email, password).then(
          async (cred) => {
            await toast.promise(
              setDoc(doc(db, "users", cred.user.uid), {
                name: username,
                haskey: false,
                email: email,
                phone: phone.current,
              }),
              {
                loading: "uploading doc to firebase database...",
                success: "Doc uploaded successfully",
                error: (error) => {
                  toast.dismiss();
                  switch (error.code) {
                    case "permission-denied":
                      return "Permission Denied: Check Firestore Security Rules";
                    case "unavailable":
                      return "Network Error: Check your internet connection";
                    case "invalid-argument":
                      return "Invalid Data Format: Check your data format";
                    case "already-exists":
                      return "Document Already Exists: Use a unique document ID";
                    case "resource-exhausted":
                      return "Rate Limit Exceeded: Implement rate limiting";
                    case "unauthenticated":
                      return "Authentication Error: User is not authenticated";
                    case "quota-exceeded":
                      return "Quota Exceeded: Check your Firebase billing and quotas";
                    default:
                      return "An unknown error occurred: ", error;
                  }
                },
              }
            );

            window.location.href = "/home";
          }
        ),
        {
          loading: "Creating your account....", // Loading message (optional)
          success: "Successfully created your account", // Displayed on successful login
          error: (error) => {
            toast.dismiss();
            // Customize error messages based on error code
            switch (error.code) {
              case "auth/email-already-in-use":
                return "Email is already in use.";
              case "auth/invalid-email":
                return "Invalid email format.";
              case "auth/missing-password":
                return "Oops you missed the password field";
              case "auth/operation-not-allowed":
                return "Operation not allowed.";
              case "auth/weak-password":
                return "Password is too weak.";
              case "auth/network-request-failed":
                return "Network request failed. Check your internet connection.";
              case "auth/too-many-requests":
                return "Too many requests. Please try again later.";
              case "auth/user-disabled":
                return "User account is disabled.";
              case "auth/user-token-expired":
                return "User token has expired.";
              case "auth/app-not-authorized":
                return "App is not authorized to use Firebase Authentication.";
              case "auth/internal-error":
                return "Internal Firebase Authentication error.";
              case "auth/missing-continue-uri":
                return "Missing continue URI.";
              case "auth/invalid-action-code":
                return "Invalid action code.";
              case "auth/expired-action-code":
                return "Expired action code.";
              default:
                return "An error occurred. Please try again.";
            }
          },
        }
      );
    } catch (error) {}*/
  };

  return (
    <>
      {isLoading ? <LoadingSign /> : null}
      <main>
        <div>{/* <Toaster position="top-right" reverseOrder={false} /> */}</div>
        <div className="login-box">
          <div className="login-inner-box">
            <div className="login-forms-wrap">
              <div className="login-form">
                <div className="login-logo">
                  <img src={logo} alt="" />
                </div>

                <div className="logo-heading">
                  <h2>New Here !!</h2>
                  <h6>Already have an account? </h6>
                  <Link to="/login" className="toggle">
                    Login
                  </Link>{" "}
                </div>
              </div>

              <div className="actual-form">
                {/* username field  */}
                <div className="input-wrap">
                  <input
                    className="input-field"
                    type="text"
                    id="username"
                    placeholder="Enter your full name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                {/* email field  */}
                <div className="input-wrap">
                  <input
                    className="input-field"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                {/* phone number  */}
                <div className="input-wrap">
                  <input
                    className="input-field"
                    type="text"
                    id="phone-number"
                    placeholder="Enter your mobile number"
                    onChange={(e) => {
                      phone.current = e.target.value;
                      const regexValid = /^[0-9]{10}/;
                      setErrorMessage(regexValid.test(phone.current));
                    }}
                    maxLength="10"
                    minLength="10"
                  />
                </div>

                {/* password field  */}
                <div className="input-wrap">
                  <input
                    className="input-field"
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  value="Sign up"
                  id="normal-sign-up-btn"
                  className="login-button sign-btn"
                  onClick={() => {
                    const usernameRequired =
                      document.querySelector("#username");
                    const passwordRequired =
                      document.querySelector("#phone-number");
                    if (
                      usernameRequired.value &&
                      passwordRequired.value &&
                      errorMessage
                    ) {
                      handleSignup();
                    } else {
                      toast.error(
                        "Username or Phone Number Not entered correctly"
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="carousel">
            <div className="heading">
              <h2>Looking for keys ???</h2>
            </div>
            <div className="body">
              <h3>Find out where they are</h3>
            </div>
            <div className="key-img">
              <img src={key} alt="" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
