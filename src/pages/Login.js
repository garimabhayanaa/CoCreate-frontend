import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [dots, setDots] = useState([]);

  useEffect(() => {
    // Generate random floating dots for the background
    const numDots = 30;
    const newDots = Array.from({ length: numDots }).map(() => ({
      id: Math.random(),
      left: `${Math.random() * 100}vw`,
      top: `${Math.random() * 100}vh`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    }));
    setDots(newDots);
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user) {
        const uid = user.uid;
        const email = user.email;

        try {
          // Create or fetch user in MongoDB
          const response = await fetch(
            "http://localhost:5001/api/user/create-user",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid, email }),
            }
          );
          if (response.ok) {
            const userData = await response.json();
            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/dashboard");
          } else {
            alert("Error creating user.");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          alert("Error connecting to the server.");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="login-container">
      {/* Background Animation */}
      <div className="background-animation">
        {dots.map((dot, index) => (
          <div
          key={dot.id}
          className="dot"
          style={{
            left: dot.left,
            top: dot.top,
            animationDuration: dot.animationDuration,
            }}
          ></div>
        ))}
      </div>

      <h1 className="login-title">CoCreate</h1>
      <button className="login-btn" onClick={handleLogin}>
        <img src="/google-icon.png" alt="Google" /> Sign in with Google
      </button>
    </div>
  );
};

export default Login;
