import React, { useState, useEffect } from "react";
import "./vendorLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorLogin = () => {
  const history = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:9000/vendorHome", { withCredentials: true })
      .then((res) => {
        const vendor = res.data;
        if (vendor) {
          history("/vendor");
        }
      })
      .catch((error) => {});
  }, []);

  return (
    //
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <form action="http://localhost:9000/auth/google">
        <button
          type="submit"
          className="p-4 border-2 border-yellow bg-purple text-white font-bold rounded-lg shadow-lg transition-colors hover:bg-white hover:text-purple"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
};

export default VendorLogin;
