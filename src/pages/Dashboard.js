import React from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Dashboard.css"; // Import the new CSS file

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-background"></div>
      <div className="dashboard-stripes"></div>
      <h1 className="dashboard-title">Dashboard</h1>

      <button onClick={() => navigate("/documents")} className="dashboard-btn">
        My Documents
      </button>

      <button onClick={() => navigate("/shared-with-me")} className="dashboard-btn">
        Shared with Me
      </button>
    </div>
  );
};

export default Dashboard;



