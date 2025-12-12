import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientReport from "./PatientReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Welcome to Lumera Report</h1>} />
       <Route path="/report/:reportId" element={<PatientReport />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
