import React, { createContext, useEffect, useState } from "react";
import app from "../Firebase/Firebase.init";
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext();
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData)
      .then(() => {
        const { displayName, email, photoURL, uid } = auth.currentUser;
        const updatedUser = { displayName, email, photoURL, uid };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .catch(error => {
        console.error("Error updating profile:", error);
      });
  };



  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { displayName, email, photoURL, uid } = currentUser;
        const userDatas = { displayName, email, photoURL, uid };
        setUser(userDatas);
        if (currentUser?.email) {
          const userData = { email: currentUser.email }
          axios.post('http://localhost:3000/jwt', userData, {
            withCredentials: true
          })
          .then(res => {
            console.log(res.data);
          }).catch(error => console.log(error))
        }
        localStorage.setItem("user", JSON.stringify(userDatas));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authData = {
    user,
    loading,
    createUser,
    signIn,
    updateUser,
    logOut,
  };

  return (
    <AuthContext.Provider value={authData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
