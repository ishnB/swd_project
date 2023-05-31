import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/solid";

function StudentHome({ setLoginUser }) {
  const [loggedIn, setLoggedin] = useState(false);
  const [student, setStudent] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [selVendor, setSelVendor] = useState({});
  const [showItems, setShowItems] = useState(false);
  const [total, setTotal] = useState(0);
  const [vendorItems, setVendorItems] = useState([]);
  const [transaction, setTransaction] = useState([]);
  const history = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:9000/studentHome", { withCredentials: true })
      .then((res) => {
        const student = res.data;
        if (student) {
          console.log(student);
          setStudent(student);
          setLoggedin(true);
        } else {
          history("/studentlogin");
        }
      })
      .catch((error) => {
        if (!loggedIn) {
          history("/studentlogin");
        }
      });
    axios.get("http://localhost:9000/vendorsList").then((res) => {
      setVendorList(res.data);
    });
  }, []);
  useEffect(() => {
    let newTotal = 0;
    transaction.forEach((item) => {
      newTotal += parseInt(item[2]);
    });
    setTotal(newTotal);
  }, [transaction]);

  const selectVendor = (vendor) => {
    console.log(vendor);
    axios.post("http://localhost:9000/vendorItems", vendor).then((res) => {
      setVendorItems(res.data.items);
      setSelVendor(res.data);
      console.log(vendorItems);
    });
  };
  const addToCart = (vendor, item) => {
    const vendorExists = transaction.some(
      ([existingVendorId]) => existingVendorId === vendor._id
    );
    if (vendorExists || transaction.length === 0) {
      console.log("Vendor ID already exists in the transaction.");
      const newItem = [vendor._id, item.itemName, item.price];
      setTransaction([...transaction, newItem]);

      return;
    } else {
      alert("You have to clear cart to add items of a different vendor!");
    }
  };
  useEffect(() => {
    console.log("cart:", transaction);
  }, [transaction]);

  const placeOrder = () => {
    var shouldPlaceOrder = window.confirm(
      "Are you sure you want to place the order?"
    );
    if (transaction.length === 0) {
      alert("Cart is Empty");
      shouldPlaceOrder = false;
    }
    if (shouldPlaceOrder) {
      console.log("order:", [transaction, student]);
      axios
        .post("http://localhost:9000/placeOrder", [transaction, student])
        .then((res) => {
          alert(res.data.message);
          setTransaction([]);
          setTotal(0);
          history("/studenttransactions");
        });
    }
  };
  const clearCart = () => {
    setTransaction([]);
    setTotal(0);
  };
  const removeItem = (index) => {
    const updatedItems = [...transaction];
    updatedItems.splice(index, 1);
    setTransaction(updatedItems);
    const removedItemValue = parseInt(transaction[index][2]);
    setTotal(total - removedItemValue);
  };
  const logout = () => {
    axios
      .post("http://localhost:9000/studentlogout", student, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        alert(res.data);
        history("/studentlogin");
      });
  };

  return (
    <>
      {loggedIn && (
        <div className="student-home">
          <button
            className="absolute top-5 right-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
            onClick={logout}
          >
            LOGOUT
          </button>
          <button
            className=" absolute top-5 left-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
            onClick={() => {
              history("/studenttransactions");
            }}
          >
            TRANSACTIONS
          </button>
          <h1 className="mb-4 text-3xl font-extrabold drop-shadow-2xl leading-none tracking-tight font-pop text-purple-900 md:text-4xl lg:text-5xl dark:text-purple my-6">
            HELLO {student.name}
          </h1>
          <p className="mb-4 text-2xl font-extrabold drop-shadow-xl leading-none tracking-tight font-pop text-purple-700 md:text-2xl lg:text-3xl dark:text-purple my-6">
            YOUR BALANCE IS{" "}
            <span className="text-green-600 bg-white px-2 rounded-lg">
              ₹ {student.balance}
            </span>
          </p>
          <div className="bg-white max-w-lg mx-auto p-4 rounded-lg shadow-lg mt-12">
            <h1 className="text-2xl text-purple font-bold mb-4">
              AVAILABLE VENDORS
            </h1>
            <ul className="bg-white max-w-lg mx-auto grid grid-cols-2 gap-2 p-2 ">
              {vendorList.map((vendor) => (
                <li
                  key={vendor._id}
                  className="border-2 border-yellow-500 p-4 flex flex-col gap-2 justify-center"
                >
                  <span className="text-xl">{vendor.name}</span>
                  <button
                    onClick={() => {
                      selectVendor(vendor);
                      setShowItems(true);
                    }}
                    className="rounded-md w-fit mx-auto border-2 bg-purple p-2 text-white uppercase text-sm"
                  >
                    Show Items
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {showItems && (
            <div className="bg-white mx-auto max-w-lg my-12 p-4 rounded-lg shadow-lg relative">
              <XMarkIcon
                onClick={() => {
                  setShowItems(false);
                }}
                className="h-6 w-6 text-purple-500 absolute top-5 right-5 cursor-pointer"
              />
              <h1 className="text-2xl text-purple font-bold mb-6">ITEMS</h1>
              <ul className="grid grid-cols-2 m-2 gap-2">
                {vendorItems.map((item) => (
                  <li className="flex flex-col gap-2 border-2 border-purple justify-center p-4">
                    <span className="uppercase text-xl font-bold">
                      {item.itemName}
                    </span>
                    <span className="font-bold text-yellow-500">
                      ₹{item.price}
                    </span>
                    <button
                      onClick={() => {
                        addToCart(selVendor, item);
                      }}
                      className="bg-purple p-2 border-white text-white w-fit mx-auto"
                    >
                      ADD TO CART
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {transaction.length != 0 && (
            <div className="cart fixed max-h-screen overflow-y-scroll mb-10 top-24 right-20 bg-white p-6 bottom-10 rounded-lg shadow-lg mr-10">
              <h1 className="text-2xl text-purple font-bold">CART</h1>
              <button
                onClick={clearCart}
                className="hover:border-2 border-2 border-white transition-colors hover:border-purple p-2 mt-4 rounded-md font-light"
              >
                CLEAR CART
              </button>
              <ul className="  py-6 flex flex-col justify-center">
                <li>
                  {transaction.map((trans, index) => (
                    <li className="border-2 m-2 p-4 border-purple max-w-sm">
                      <ul className="">
                        <li className="uppercase text-lg font-bold">
                          {trans[1]}
                        </li>
                        <li className="text-yellow-500 font-bold">
                          ₹ {trans[2]}
                        </li>
                        <li>
                          <TrashIcon
                            onClick={() => {
                              removeItem(index);
                            }}
                            className="h-6 w-6 text-purple-500 mx-auto mt-2 cursor-pointer"
                          />
                        </li>
                      </ul>
                    </li>
                  ))}{" "}
                </li>
              </ul>
              <h1 className="text-xl font-bold mb-2">TOTAL: ₹{total}</h1>
              <button
                onClick={() => {
                  placeOrder(transaction);
                }}
                className="rounded-md w-fit mx-auto border-2 border-yellow-500 hover:bg-purple hover:text-white transition-colors p-2 text-purple uppercase text-sm"
              >
                PLACE ORDER
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default StudentHome;
