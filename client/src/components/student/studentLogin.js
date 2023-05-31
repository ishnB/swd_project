import React, { useState, useEffect } from "react";
import "./studentLogin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const history = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:9000/studentHome", { withCredentials: true })
      .then((res) => {
        const student = res.data;
        if (student) {
          history("/student");
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <form action="http://localhost:9000/auth/google/student">
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

export default StudentLogin;
