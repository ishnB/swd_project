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

function App() {
  const [user, setLoginUser] = useState({});
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/student" element={<StudentHome />} />
          <Route exact path="/vendor" element={<VendorHome />} />
          <Route
            exact
            path="/vendorlogin"
            element={<VendorLogin setLoginUser={setLoginUser} />}
          />
          <Route exact path="/vendorregister" element={<VendorRegister />} />
          <Route
            exact
            path="/studentlogin"
            element={<StudentLogin setLoginUser={setLoginUser} />}
          />
          <Route exact path="/studentregister" element={<StudentRegister />} />
        </Routes>
      </BrowserRouter>
      {/* <h1>{post}</h1> */}
    </div>
  );
}

export default App;
