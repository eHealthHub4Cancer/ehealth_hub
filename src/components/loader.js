import React from "react";
import "./loader.css";

function Loader({ percentage, dataName }) {
  return (
    <div className="loader">
      <div className="spinner"></div>
      <p>Loading {dataName}... {percentage}%</p>
    </div>
  );
}

export default Loader;
