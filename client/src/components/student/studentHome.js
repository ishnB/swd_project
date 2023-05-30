import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentHome({ setLoginUser }) {
  const [loggedIn, setLoggedin] = useState(false);
  const [student, setStudent] = useState({});
  const [vendorList, setVendorList] = useState([]);
  const [selVendor, setSelVendor] = useState({});
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
    const shouldPlaceOrder = window.confirm(
      "Are you sure you want to place the order?"
    );
    if (shouldPlaceOrder) {
      console.log("order:", [transaction, student]);
      axios
        .post("http://localhost:9000/placeOrder", [transaction, student])
        .then((res) => {
          alert(res.data.message);
        });
    }
  };

  return (
    <>
      {loggedIn && (
        <div className="student-home">
          <h1>HELLO {student.name}</h1>
          <p>YOUR BALANCE IS {student.balance}</p>

          <ul>
            {vendorList.map((vendor) => (
              <li key={vendor._id}>
                <button
                  onClick={() => {
                    selectVendor(vendor);
                  }}
                >
                  Show Items
                </button>
                <span>{vendor.name}</span>
              </li>
            ))}
          </ul>
          <ul>
            {vendorItems.map((item) => (
              <li>
                <span>{item.itemName}</span>
                <span>{item.price}</span>
                <button
                  onClick={() => {
                    addToCart(selVendor, item);
                  }}
                >
                  ADD TO CART
                </button>
              </li>
            ))}
            {transaction && (
              <button
                onClick={() => {
                  placeOrder(transaction);
                }}
              >
                PLACE ORDER
              </button>
            )}
          </ul>
        </div>
      )}
    </>
  );
}

export default StudentHome;
