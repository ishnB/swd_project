import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TrashIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";

function VendorHome({ setLoginUser }) {
  const [loggedIn, setLoggedin] = useState(false);
  const [vendor, setVendor] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [itemList, setItemList] = useState([]);
  const history = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:9000/vendorHome", { withCredentials: true })
      .then((res) => {
        const vendor = res.data;
        if (vendor) {
          setVendor(vendor);
          setLoggedin(true);
          setItemList(vendor.items);
        } else {
          history("/vendorlogin");
        }
      })
      .catch((error) => {
        if (!loggedIn) {
          history("/vendorlogin");
        }
      });
  }, []);

  const [item, setItem] = useState({
    name: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({
      ...item,
      [name]: value,
    });
  };

  const register = () => {
    const { name, price } = item;
    const { _id } = vendor;
    if (name && price && _id) {
      axios
        .post("http://localhost:9000/vendoradd", { name, price, _id })
        .then((response) => {
          const { data } = response;
          setItemList(data.data);
          alert(data.alert);
          setItem({ name: "", price: "" });
        });
    } else {
      alert("Invalid Input");
    }
  };
  const removeItem = (item) => {
    axios
      .post("http://localhost:9000/vendorremove", [item, vendor._id])
      .then((res) => {
        const { data } = res;
        setItemList(data.data);
        alert(data.alert);
      });
  };
  const logout = () => {
    axios
      .post("http://localhost:9000/vendorlogout", vendor, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        history("/vendorlogin");
      });
  };
  return (
    <>
      {loggedIn && (
        <div className="vendor-home">
          <button
            className="absolute top-5 right-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
            onClick={logout}
          >
            LOGOUT
          </button>
          <button
            className=" absolute top-5 left-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
            onClick={() => {
              history("/vendortransactions");
            }}
          >
            TRANSACTIONS
          </button>
          <h1 className="mb-4 text-3xl font-extrabold drop-shadow-2xl leading-none tracking-tight font-pop text-purple-900 md:text-4xl lg:text-5xl dark:text-purple my-6">
            WELCOME {vendor.name}
          </h1>

          <div className="bg-white relative flex flex-col justify-center px-6 py-10 lg:px-8 rounded shadow-lg max-w-sm mx-auto mb-12">
            <button
              className="add-title text-purple text-xl cursor-pointer border-2 border-white hover:border-2 hover:border-purple transition-colors w-1/2 mx-auto rounded-md shadow-md"
              onClick={() => {
                setShowAdd(true);
              }}
            >
              ADD ITEMS
            </button>

            {showAdd && (
              <div className="flex-col  space-y-4 mt-8 sm:mx-auto sm:w-full sm:max-w-sm ">
                <XMarkIcon
                  onClick={() => {
                    setShowAdd(false);
                  }}
                  className="h-6 w-6 text-purple-500 absolute top-5 right-5 cursor-pointer hover:text-red-500 transition-colors"
                />
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
                      value={item.name}
                      placeholder="Name"
                      onChange={handleChange}
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    for="price"
                    class="text-left block text-sm font-medium leading-6 text-gray-900"
                  >
                    Price
                  </label>
                  <div class="mt-2">
                    <input
                      type="text"
                      name="price"
                      value={item.price}
                      placeholder="Price"
                      onChange={handleChange}
                      required
                      class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    ></input>
                  </div>
                </div>
                <div
                  className="login-btn flex w-full justify-center rounded-md bg-purple px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-purple hover:border-2 border-2 hover:border-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                  onClick={register}
                >
                  ADD
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded shadow-lg max-w-3xl mx-auto mb-12  py-4 px-4 ">
            <h1 className="text-2xl text-purple font-bold mb-6">ITEMS</h1>
            <ul className="bg-white grid grid-cols-3 gap-4 justify-center">
              {itemList.map((item) => (
                <li className="border-2 border-purple py-2 px-2 flex flex-col justify-evenly">
                  <ul className="flex flex-col ">
                    <li className="uppercase text-lg ">{item.itemName}</li>
                    <li className="text-yellow-500 font-bold">
                      ₹ {item.price}
                    </li>
                    <li
                      onClick={() => {
                        removeItem(item);
                      }}
                    >
                      <TrashIcon className="h-6 w-6 text-purple-500 mx-auto mt-2 cursor-pointer hover:text-red-500 transition-colors" />
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorHome;
