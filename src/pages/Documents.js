import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Documents.css";

const Documents = () => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5001/api/documents/user/${user.uid}`)
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Error fetching documents:", err));
  }, []);

  const openDocument = (docId) => {
    navigate(`/editor/${docId}`);
  };

  const createFile = async () => {
    if (!fileName.trim()) {
      alert("Please enter a file name.");
      return;
    }

    const response = await fetch("http://localhost:5001/api/documents/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: fileName, type: "doc", owner: user.uid }), // Ensure 'type' is included
    });

    if (response.ok) {
      const newFile = await response.json();
      setFiles([...files, newFile]);
      setFileName("");
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  };

  const deleteFile = async (fileId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    const response = await fetch(
      `http://localhost:5001/api/documents/delete/${fileId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setFiles(files.filter((file) => file._id !== fileId)); // ✅ Ensure UI updates
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  };

  return (
    <div className="documents-container">
      <h1>My Files</h1>

      <div className="file-input">
        <input
          type="text"
          placeholder="Enter file name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <button onClick={createFile}>Create File</button>
      </div>

      <ul className="file-list">
        {files.length > 0 ? (
          files.map((file) => (
            <li key={file._id} className="file-item">
              <span>{file.title}</span>
              <button onClick={() => openDocument(file._id)}>Open</button>
              <button
                onClick={() => deleteFile(file._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No files created yet.</p>
        )}
      </ul>
    </div>
  );
};

export default Documents;
