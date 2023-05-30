import { React, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import VendorLogin from "./components/vendor/vendorLogin";
import VendorRegister from "./components/vendor/vendorRegister";
import StudentLogin from "./components/student/studentLogin";
import StudentRegister from "./components/student/studentRegister";
import StudentHome from "./components/student/studentHome";
import VendorHome from "./components/vendor/vendorHome";
import Homepage from "./components/homepage/homepage";
import "./App.css";
import StudentTransactions from "./components/student/studentTransactions";
import QrScanner from "./components/student/qrscanner";
import VendorTransactions from "./components/vendor/vendortransactions";

function App() {
  const [vendorUser, setLoginVendor] = useState({});
  const [studentUser, setLoginStudent] = useState({});
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route
            exact
            path="/student"
            element={studentUser && <StudentHome />}
          />
          <Route exact path="/qrscanner" element={<QrScanner />} />
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
          <Route
            exact
            path="/vendorlogin"
            element={<VendorLogin setLoginVendor={setLoginVendor} />}
          />
          <Route exact path="/vendorregister" element={<VendorRegister />} />
          <Route
            exact
            path="/studentlogin"
            element={<StudentLogin setLoginStudent={setLoginStudent} />}
          />
          <Route exact path="/studentregister" element={<StudentRegister />} />
        </Routes>
      </BrowserRouter>
      {/* <h1>{post}</h1> */}
    </div>
  );
}

export default App;
