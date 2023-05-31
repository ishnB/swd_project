import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";
import { XMarkIcon, QrCodeIcon } from "@heroicons/react/24/solid";

function StudentTransactions() {
  const [loggedIn, setLoggedin] = useState(false);
  const [student, setStudent] = useState({});
  const [transactionListPending, setTransactionListPending] = useState([]);
  const [transactionListCompleted, setTransactionListCompleted] = useState([]);
  const [showIsPending, setShowPending] = useState(false);
  const [showIsCompleted, setShowCompleted] = useState(false);
  const [result, setResult] = useState("");
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
  }, []);

  const showPending = () => {
    axios
      .post("http://localhost:9000/studentTransactionsPending", student)
      .then((res) => {
        setTransactionListPending(res.data);
        setShowPending(true);
      });
  };
  const showCompleted = () => {
    axios
      .post("http://localhost:9000/studentTransactionsCompleted", student)
      .then((res) => {
        setTransactionListCompleted(res.data);
        setShowCompleted(true);
      });
  };
  const scanQr = (e, transaction) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    QrScanner.scanImage(file, { returnDetailedScanResult: true })
      .then((result) => {
        setResult(result.data);
        console.log(result.data);
        console.log(transaction);
        axios
          .post("http://localhost:9000/checkTransaction", [
            result.data,
            transaction,
            student,
          ])
          .then((res) => {
            alert(res.data.message);
            showPending();
            showCompleted();
          });
      })
      .catch((e) => console.log(e));
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
    <div className="student-transactions">
      <button
        className="absolute top-5 right-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
        onClick={logout}
      >
        LOGOUT
      </button>
      <button
        className=" absolute top-5 left-5 z-10 border-2 border-yellow-500 bg-white shadow-lg p-2 mb-4 rounded-lg font-extrabold text-purple hover:bg-purple hover:text-white transition-colors"
        onClick={() => {
          history("/student");
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
          className="text-4xl mt-8 text-red-500 font-bold"
        >
          SHOW PENDING TRANSACTIONS
        </button>
        {showIsPending && (
          <ul className="w-1/2 mx-auto my-12 grid grid-cols-2 gap-4 relative py-8">
            <XMarkIcon
              onClick={() => {
                setShowPending(false);
              }}
              className="h-6 w-6 text-purple-500 absolute top-0 right-0 cursor-pointer hover:text-red-500 transition-colors"
            />
            {transactionListPending.map((transaction) => (
              <ul className="bg-white rounded-lg shadow-lg px-8 py-6 relative flex flex-col justify-center">
                <li>
                  {transaction.items[0].map((trans) => (
                    <li className="border-2 m-2 p-2 rounded-md">
                      <ul>
                        <li className="uppercase text-lg font-bold">
                          {trans[1]}
                        </li>
                        <li className="text-yellow-500 font-bold">
                          ₹ {trans[2]}
                        </li>
                      </ul>
                    </li>
                  ))}{" "}
                  <li className="font-bold mt-4 border-2 p-2">
                    TOTAL: ₹{transaction.total}
                  </li>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => scanQr(e, transaction)}
                      className="mx-auto my-4 absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    ></input>
                    <div className="bg-purple py-2 px-4 rounded-md shadow-sm mt-4 text-white font-bold inline-block">
                      Upload QR
                    </div>
                  </div>
                </li>
              </ul>
            ))}
          </ul>
        )}
        <button
          onClick={showCompleted}
          className="text-4xl mt-8 mb-8 text-green-500 font-bold"
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
              <ul className="bg-white rounded-lg shadow-lg px-8 py-6 flex flex-col justify-center">
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

export default StudentTransactions;
