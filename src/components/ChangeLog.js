import React, { useState, useEffect } from "react";

const ChangeLog = ({ documentId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5001/api/changelog/${documentId}`)
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching change logs:", err));
  }, [documentId]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "20px" }}>
      <h3>Change Log</h3>
      <ul>
        {logs.length > 0 ? (
          logs.map((log, index) => (
            <li key={index}>
              <strong>{log.userEmail}</strong> at {new Date(log.timestamp).toLocaleString()}
            </li>
          ))
        ) : (
          <p>No changes recorded.</p>
        )}
      </ul>
    </div>
  );
};

export default ChangeLog;
