import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/SharedWithMe.css";

const SharedWithMe = () => {
  const [documents, setDocuments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/documents/collaborator/${user.email}`)
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Error fetching shared documents:", err));
  }, []);

  return (
    <div className="shared-container">
      <h1 className="shared-title">Shared with Me</h1>

      {documents.length > 0 ? (
        <div className="shared-documents-list">
          {documents.map((doc) => {
            const permission = doc.collaborators.find(
              (c) => c.email === user.email
            )?.permission;
            return (
              <button
                key={doc._id}
                className="shared-document-button"
                onClick={() => navigate(`/editor/${doc._id}`)}
              >
                {doc.title} ({permission})
              </button>
            );
          })}
        </div>
      ) : (
        <p className="shared-empty">No shared documents.</p>
      )}
    </div>
  );
};

export default SharedWithMe;
