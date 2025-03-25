import React, { useState, useEffect } from "react";
import "../stylesheets/Collaborators.css";

const Collaborators = ({ documentId }) => {
  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState("view");
  const [collaborators, setCollaborators] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/collaborators/${documentId}`)
      .then((res) => res.json())
      .then((data) => setCollaborators(data.collaborators))
      .catch((err) => console.error("Error fetching collaborators:", err));
  }, [documentId]);

  const addCollaborator = async () => {
    const response = await fetch("http://localhost:5001/api/collaborators/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, email, permission }),
    });

    if (response.ok) {
      setCollaborators([...collaborators, { email, permission }]);
      setEmail("");
    }
  };

  const removeCollaborator = async (collabEmail) => {
    const response = await fetch("http://localhost:5001/api/collaborators/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId, email: collabEmail }),
    });

    if (response.ok) {
      setCollaborators(collaborators.filter((c) => c.email !== collabEmail));
    }
  };

  const getInitials = (email) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="collaborators-container">
      <h3 className="collaborators-title">Collaborators</h3>

      <div className="collaborators-form">
        <input
          type="email"
          className="collaborators-input"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <select
          className="collaborators-select"
          value={permission}
          onChange={(e) => setPermission(e.target.value)}
        >
          <option value="view">View</option>
          <option value="edit">Edit</option>
        </select>
        <button className="collaborators-add-btn" onClick={addCollaborator}>
          Add
        </button>
      </div>

      {collaborators.length > 0 ? (
        <ul className="collaborators-list">
          {collaborators.map((c, index) => (
            <li key={index} className="collaborators-item">
              <div className="collaborators-info">
                <div className="collaborators-avatar">{getInitials(c.email)}</div>
                <span className="collaborators-email">{c.email}</span>
                <span className={`collaborators-permission collaborators-permission-${c.permission}`}>
                  {c.permission}
                </span>
              </div>
              <button
                className="collaborators-remove-btn"
                onClick={() => removeCollaborator(c.email)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="collaborators-empty">No collaborators added yet.</p>
      )}
    </div>
  );
};

export default Collaborators;

