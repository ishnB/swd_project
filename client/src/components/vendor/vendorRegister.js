import React, { useState } from "react";
import "./vendorRegister.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VendorRegister = () => {
  const history = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const register = () => {
    const { name, email, password, cpassword } = user;
    if (name && email && password && password === cpassword) {
      axios.post("http://localhost:9000/vendorregister", user).then((res) => {
        alert(res.data.message);
        history("/vendorlogin");
      });
    } else {
      alert("invlid input");
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <h1 className="login-title">Register</h1>
      {/* <div className="login-form">
        <label
          for="name"
          class="block text-sm font-medium leading-6 text-gray-900"
        >
          Name
        </label>
        <div className="mt-2">
          <input
            type="text"
            name="name"
            value={user.name}
            placeholder="Name"
            onChange={handleChange}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          ></input>
        </div>
        <input
          type="text"
          name="email"
          value={user.email}
          placeholder="Email"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          name="password"
          value={user.password}
          placeholder="Password"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          name="cpassword"
          value={user.cpassword}
          placeholder="Re-enter Password"
          onChange={handleChange}
        ></input>
      </div> */}
      <div class="flex-col space-y-4 mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div>
          <label
            for="name"
            class="text-left block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div class="mt-2">
            <input
              type="text"
              name="name"
              value={user.name}
              placeholder="Name"
              onChange={handleChange}
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
          </div>
        </div>
        <div>
          <label
            for="email"
            class="text-left block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div class="mt-2">
            <input
              type="text"
              name="email"
              value={user.email}
              placeholder="Email"
              onChange={handleChange}
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
          </div>
        </div>

        <div>
          <label
            for="password"
            class="text-left block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <div class="mt-2">
            <input
              type="password"
              name="password"
              value={user.password}
              placeholder="Password"
              onChange={handleChange}
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
          </div>
        </div>
        <div>
          <label
            for="cpassword"
            class="text-left block text-sm font-medium leading-6 text-gray-900"
          >
            Re-Enter Password
          </label>
          <div class="mt-2">
            <input
              type="password"
              name="cpassword"
              value={user.cpassword}
              placeholder="Re-enter Password"
              onChange={handleChange}
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            ></input>
          </div>
        </div>
        <div
          className="login-btn flex w-full justify-center rounded-md bg-purple px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-purple hover:border-2 hover:border-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={register}
        >
          Register
        </div>
        <div>OR</div>
        <div
          className="login-btn flex w-full justify-center rounded-md bg-purple px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-purple hover:border-2 hover:border-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => history("/vendorlogin")}
        >
          Login
        </div>
      </div>
    </div>
  );
};

export default VendorRegister;
