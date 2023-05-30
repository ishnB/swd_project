import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";

function StudentTransactions() {
  const [loggedIn, setLoggedin] = useState(false);
  const [student, setStudent] = useState({});
  const [transactionList, setTransactionList] = useState([]);
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

  const handleClick = () => {
    axios
      .post("http://localhost:9000/studentTransactions", student)
      .then((res) => {
        setTransactionList(res.data);
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
            // setTransactionList(res.data);
          });
      })
      .catch((e) => console.log(e));
  };
  return (
    <>
      <h1>TRANSACTIONS</h1>
      <button onClick={handleClick}>SHOW TRANSACTIONS</button>
      <ul>
        {transactionList.map((transaction) => (
          <ul>
            <li>
              {transaction.items[0].map((trans) => (
                <li>
                  {trans[1]} AND {trans[2]}
                </li>
              ))}{" "}
              <input
                type="file"
                onChange={(e) => scanQr(e, transaction)}
              ></input>
            </li>
          </ul>
        ))}
      </ul>
    </>
  );
}

export default StudentTransactions;
