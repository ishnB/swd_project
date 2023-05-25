import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VendorHome({ setLoginUser }) {
  const [loggedIn, setLoggedin] = useState(false);
  const [vendor, setVendor] = useState({});
  const [itemList, setItemList] = useState([]);
  const history = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:9000/vendorHome", { withCredentials: true })
      .then((res) => {
        const vendor = res.data;
        if (vendor) {
          console.log(vendor);
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
        });
    } else {
      alert("invlid input");
    }
  };
  return (
    <>
      {loggedIn && (
        <div class="vendor-home">
          <h1>HELLO {vendor.name}</h1>

          <h2>ADD ITEMS</h2>
          <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
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
                className="login-btn flex w-full justify-center rounded-md bg-purple px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-white hover:text-purple hover:border-2 hover:border-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={register}
              >
                ADD
              </div>
            </div>
          </div>
          <ul>
            {itemList.map((item) => (
              <li>
                <span>{item.itemName}</span>
                <span>{item.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default VendorHome;
