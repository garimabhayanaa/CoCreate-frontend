import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "../stylesheets/OnlineUsers.css";

const socket = io("http://localhost:5001"); // ✅ Create a single persistent socket instance

const OnlineUsers = ({ documentId, user }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!documentId || !user) return;

    console.log(`Joining document: ${documentId} as ${user.email}`);

    // ✅ Join document with user details
    socket.emit("join-document", { documentId, user });

    // ✅ Listen for updates
    socket.on("update-users", (updatedUsers) => {
      console.log("Updated user list:", updatedUsers);
      setUsers(updatedUsers);
    });

    return () => {
      console.log(`Leaving document: ${documentId} as ${user.email}`);
      
      // ✅ Properly emit leave event
      socket.emit("leave-document", { documentId, user });

      // ✅ Do not disconnect the socket globally, keep it persistent
    };
  }, [documentId, user]);

  // Function to get initials from email
  const getInitials = (email) => email.slice(0, 2).toUpperCase();

  return (
    <div className="online-users-container">
      <h3 className="online-users-title">Online Users</h3>
      {users.length > 0 ? (
        <ul className="online-users-list">
          {users.map((u) => (
            <li key={u.uid} className="online-users-item">
              <div className="online-users-avatar">{getInitials(u.email)}</div>
              <span className={u.uid === user.uid ? "online-users-name online-users-you" : "online-users-name"}>
                {u.email} {u.uid === user.uid ? "(You)" : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="online-users-empty">No one else is online.</p>
      )}
    </div>
  );
};

export default OnlineUsers;
