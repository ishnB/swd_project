import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VendorLogin from "./components/vendor/vendorLogin";
import StudentLogin from "./components/student/studentLogin";
import StudentHome from "./components/student/studentHome";
import VendorHome from "./components/vendor/vendorHome";
import Homepage from "./components/homepage/homepage";
import "./App.css";
import StudentTransactions from "./components/student/studentTransactions";
import VendorTransactions from "./components/vendor/vendortransactions";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/student" element={<StudentHome />} />
          <Route
            exact
            path="/studenttransactions"
            element={<StudentTransactions />}
          />
          <Route
            exact
            path="/vendortransactions"
            element={<VendorTransactions />}
          />
          <Route exact path="/vendor" element={<VendorHome />} />
          <Route exact path="/vendorlogin" element={<VendorLogin />} />
          <Route exact path="/studentlogin" element={<StudentLogin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
