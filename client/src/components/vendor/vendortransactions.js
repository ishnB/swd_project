import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { XMarkIcon, QrCodeIcon, TrashIcon } from "@heroicons/react/24/solid";
import QRCode from "react-qr-code";

function VendorTransactions() {
  const [loggedIn, setLoggedin] = useState(false);
  const [vendor, setVendor] = useState({});
  const [isQr, setQr] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [showIsPending, setShowPending] = useState(false);
  const [showIsCompleted, setShowCompleted] = useState(false);
  const [transactionListPending, setTransactionListPending] = useState([]);
  const [transactionListCompleted, setTransactionListCompleted] = useState([]);
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
        } else {
          console.log(vendor);
          history("/vendorlogin");
        }
      })
      .catch((error) => {
        if (!loggedIn) {
          history("/vendorlogin");
        }
      });
  }, []);

  const showPending = () => {
    setShowPending(true);
    axios
      .post("http://localhost:9000/vendorTransactionsPending", vendor)
      .then((res) => {
        setTransactionListPending(res.data);
      });
  };
  const showCompleted = () => {
    setShowCompleted(true);
    axios
      .post("http://localhost:9000/vendorTransactionsCompleted", vendor)
      .then((res) => {
        setTransactionListCompleted(res.data);
      });
  };
  const showQR = (transaction) => {
    setQrValue(transaction._id);
    setQr(true);
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
  const removeTransaction = (transaction) => {
    axios
      .post("http://localhost:9000/removeTransaction", transaction)
      .then((res) => {
        alert(res.data.message);
        showPending();
      });
  };

  return (
    <div className="transactions-page relative">
      <button
        className="absolute top-5 right-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
        onClick={logout}
      >
        LOGOUT
      </button>
      <button
        className=" absolute top-5 left-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
        onClick={() => {
          history("/vendor");
        }}
      >
        HOME
      </button>
      <h1 className="mb-4 text-4xl font-extrabold drop-shadow-2xl leading-none tracking-tight font-pop text-purple-900 md:text-4xl lg:text-6xl dark:text-purple my-6">
        TRANSACTIONS
      </h1>
      <div className="flex flex-col relative mt-12">
        <button
          onClick={showPending}
          className="text-4xl text-red-500 font-bold"
        >
          SHOW PENDING TRANSACTIONS
        </button>
        {showIsPending && (
          <ul className=" w-1/2 mx-auto my-12 grid grid-cols-2 gap-4 relative py-8">
            <XMarkIcon
              onClick={() => {
                setShowPending(false);
              }}
              className="h-6 w-6 text-purple-500 absolute top-0 right-0 cursor-pointer hover:text-red-500 transition-colors"
            />
            {transactionListPending.map((transaction) => (
              <ul className="bg-white rounded-lg shadow-lg px-8 py-6 relative flex flex-col justify-center">
                <li>
                  <QrCodeIcon
                    onClick={() => {
                      showQR(transaction);
                    }}
                    className="h-8 w-8 text-purple-500 absolute top-2 left-2 cursor-pointer hover:text-green-500 transition-colors"
                  />
                  <TrashIcon
                    onClick={() => {
                      removeTransaction(transaction);
                    }}
                    className="h-8 w-8 text-purple-500 absolute top-2 right-2 cursor-pointer hover:text-red-500 transition-colors"
                  />
                  {transaction.items[0].map((trans) => (
                    <li className="border-2 m-2 p-2 rounded-md">
                      <ul>
                        <li className="uppercase text-lg">{trans[1]}</li>
                        <li className="font-bold text-yellow-500">
                          {" "}
                          ₹ {trans[2]}
                        </li>
                      </ul>
                    </li>
                  ))}{" "}
                  <li className="font-bold mt-4 border-2 p-2">
                    TOTAL: ₹{transaction.total}
                  </li>
                </li>
              </ul>
            ))}
          </ul>
        )}
        {isQr && (
          <div className="QR-display absolute top-50 left-50 bg-white w-screen">
            <QRCode
              size={1024}
              style={{
                padding: "10%",
                height: "auto",
                maxWidth: "30%",
                width: "30%",
              }}
              className="mx-auto"
              value={qrValue}
              viewBox={`0 0 256 256`}
            />

            <XMarkIcon
              onClick={() => {
                setQr(!isQr);
              }}
              className="h-10 w-10 text-purple-500 absolute top-5 right-5 cursor-pointer hover:text-red-500 transition-colors"
            />
          </div>
        )}
        <button
          onClick={showCompleted}
          className="text-4xl mt-8 text-green-500 font-bold"
        >
          SHOW COMPLETED TRANSACTIONS
        </button>
        {showIsCompleted && (
          <ul className="w-1/2 mx-auto my-12 grid grid-cols-2 gap-4 relative py-8">
            <XMarkIcon
              onClick={() => {
                setShowCompleted(false);
              }}
              className="h-6 w-6 text-purple-500 absolute top-0 right-0 cursor-pointer hover:text-red-500 transition-colors"
            />
            {transactionListCompleted.map((transaction) => (
              <ul className=" bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col justify-center">
                <li>
                  {transaction.items[0].map((trans) => (
                    <li className="border-2 m-2 p-2">
                      <ul className="">
                        <li className="uppercase text-lg">{trans[1]}</li>
                        <li className="text-yellow-500 font-bold">
                          ₹ {trans[2]}
                        </li>
                      </ul>
                    </li>
                  ))}{" "}
                </li>
                <li className="font-bold mt-4 border-2 p-2">
                  TOTAL: ₹{transaction.total}
                </li>
              </ul>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default VendorTransactions;
