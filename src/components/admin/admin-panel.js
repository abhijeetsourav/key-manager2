import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import "./admin-panel.css";

const AdminPanel = () => {
  const [option, setOption] = useState("Logs");
  const [usersDocs, setUsersDocs] = useState({});
  const [memberRequestsDocs, setMemberRequestsDocs] = useState({});

  useEffect(() => {
    const usersCollection = collection(db, "users");
    getDocs(usersCollection).then((collection) => {
      const object = {};
      collection.docs.forEach((doc) => {
        object[doc.id] = doc.data();
      });
      setUsersDocs(object);
    });
    const usersCollectionSnapshot = onSnapshot(
      collection(db, "users"),
      (collecSnapshot) => {
        // console.log(collecSnapshot);
        collecSnapshot.docChanges().forEach((change) => {
          // console.log(change.type);
          if (change.type === "added") {
          }
          if (change.type === "modified") {
            // setMemberRequestsDocs({...usersDocs, change.doc})
          }
          if (change.type === "removed") {
          }
        });
      }
    );

    const requestsCollection = collection(db, "admin");
    getDocs(requestsCollection).then((collection) => {
      const object = {};
      collection.docs.forEach((doc) => {
        object[doc.id] = doc.data();
      });
      setMemberRequestsDocs(object);
    });
    const requestsCollectionSnapshot = onSnapshot(
      collection(db, "admin"),
      (collecSnapshot) => {
        // console.log(collecSnapshot);
        collecSnapshot.docChanges().forEach((change) => {
          // console.log(change.type);
          if (change.type === "added") {
          }
          if (change.type === "modified") {
            // setMemberRequestsDocs({...usersDocs, change.doc})
          }
          if (change.type === "removed") {
          }
        });
      }
    );
    return () => {
      usersCollectionSnapshot();
      requestsCollectionSnapshot();
    };
  }, []);

  const handleModifybtn = async (id) => {};
  const handleDeletebtn = async (id) => {};
  const handleAcceptbtn = async (id) => {
    const docRef = doc(db, "admin", id);
    const document = await getDoc(docRef);
    await toast.promise(
      setDoc(doc(db, "users", document.id), document.data()),
      {
        loading: "adding new member",
        success: "A new member has been succesfully added",
        error: (error) => {
          toast.dismiss();
          console.log(error);
        },
      }
    );
    await toast.promise(deleteDoc(doc(db, "admin", document.id)), {
      loading: "wait...",
      success: "All set",
      error: (error) => {
        toast.dismiss();
        console.log(error);
      },
    });
  };
  const handleDeclinebtn = async (id) => {};

  // Object.keys(usersDocs).forEach((docKey) => {
  //   console.log(typeof docKey);
  // console.log(usersDocs.docKey());
  // });
  /*const grantPermission = async (id, object) => {
    // adding data to the main database on successful permission by the admin
    await toast.promise(setDoc(doc(db, "users", id), object), {
      loading: "Giving member access to the app",
      success: "Access granted",
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
    });
  };*/

  return (
    <>
      <div className="main-body">
        <div className="nav-bar">
          <ul>
            <li
              className={
                option === "Logs"
                  ? "selected-nav-bar-li-element"
                  : "unselected-nav-bar-li-element"
              }
              onClick={() => {
                setOption("Logs");
              }}
            >
              Logs
            </li>
            <li
              className={
                option === "Member Requests"
                  ? "selected-nav-bar-li-element"
                  : "unselected-nav-bar-li-element"
              }
              onClick={() => {
                setOption("Member Requests");
              }}
            >
              Member Requests
            </li>
            <li
              className={
                option === "Registered Members"
                  ? "selected-nav-bar-li-element"
                  : "unselected-nav-bar-li-element"
              }
              onClick={() => {
                setOption("Registered Members");
              }}
            >
              Registered members
            </li>
          </ul>
        </div>

        {option === "Logs" ? (
          <>
            <h1>Logs</h1>
          </>
        ) : option === "Member Requests" ? (
          <>
            <h1>New Member Requests</h1>
            <ul>
              {Object.keys(memberRequestsDocs).map((docKey) => {
                return (
                  <>
                    <li className="new-mem-req-li-element">
                      <div
                        id={`new-mem-req-${docKey}`}
                        className="new-mem-req-div-element"
                        object={memberRequestsDocs}
                        onClick={(e) => {
                          const elements = document.querySelectorAll(
                            ".new-mem-req-drop-down-ul-element"
                          );

                          const visibleElements = Array.from(elements).filter(
                            (element) => !element.hidden
                          );
                          if (visibleElements.length) {
                            visibleElements[0].hidden = true;
                          }
                          document.getElementById(
                            `${e.target.id}-drop-down`
                          ).hidden = false;
                        }}
                      >
                        {memberRequestsDocs[docKey]["name"]}
                      </div>
                      <div id={docKey}>
                        <button
                          onClick={(e) => {
                            handleAcceptbtn(e.target.parentElement.id);
                          }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={(e) => {
                            handleDeclinebtn(e.target.parentElement.id);
                          }}
                        >
                          Decline
                        </button>
                      </div>
                    </li>
                    <ul
                      id={`new-mem-req-${docKey}-drop-down`}
                      className="new-mem-req-drop-down-ul-element"
                      hidden={true}
                    >
                      <li key="1">{`Email: ${memberRequestsDocs[docKey]["email"]}`}</li>
                      <li key="2">{`Phone: ${memberRequestsDocs[docKey]["phone"]}`}</li>
                      <li key="3">{`RollNo.: `}</li>
                    </ul>
                  </>
                );
              })}
            </ul>
          </>
        ) : (
          <>
            <h1>Registered Members</h1>
            <ul>
              {Object.keys(usersDocs).map((docKey) => {
                return (
                  <>
                    <li className="reg-mem-li-element">
                      <div
                        id={`reg-mem-${docKey}`}
                        className="reg-mem-div-element"
                        object={usersDocs}
                        onClick={(e) => {
                          const elements = document.querySelectorAll(
                            ".reg-mem-drop-down-ul-element"
                          );

                          const visibleElements = Array.from(elements).filter(
                            (element) => !element.hidden
                          );
                          console.log("visibleElements: ", visibleElements);
                          if (visibleElements.length) {
                            visibleElements[0].hidden = true;
                          }
                          const element = document.getElementById(
                            `${e.target.id}-drop-down`
                          );
                          console.log("element: ", element, e.target.id);
                          element.hidden = false;
                        }}
                      >
                        {usersDocs[docKey]["name"]}
                      </div>
                      <div id={docKey}>
                        <button
                          onClick={(e) => {
                            handleModifybtn(e.target.parentElement.id);
                          }}
                        >
                          Modify
                        </button>
                        <button
                          onClick={(e) => {
                            handleDeletebtn(e.target.parentElement.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                    <ul
                      id={`reg-mem-${docKey}-drop-down`}
                      className="reg-mem-drop-down-ul-element"
                      hidden={true}
                    >
                      <li key="1">{`Email: ${usersDocs[docKey]["email"]}`}</li>
                      <li key="2">{`Phone: ${usersDocs[docKey]["phone"]}`}</li>
                      <li key="3">{`RollNo.: `}</li>
                    </ul>
                  </>
                );
              })}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
