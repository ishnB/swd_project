import { React, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

function VendorTransactions() {
  const [loggedIn, setLoggedin] = useState(false);
  const [vendor, setVendor] = useState({});
  const [isQr, setQr] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [transactionList, setTransactionList] = useState([]);
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
          history("/vendorlogin");
        }
      })
      .catch((error) => {
        if (!loggedIn) {
          history("/vendorlogin");
        }
      });
  }, []);

  const handleClick = () => {
    axios
      .post("http://localhost:9000/vendorTransactions", vendor)
      .then((res) => {
        setTransactionList(res.data);
      });
  };
  const showQR = (transaction) => {
    setQrValue(transaction._id);
    setQr(true);
  };
  return (
    <>
      <h1>TRANSACTIONS</h1>
      <button onClick={handleClick}>SHOW TRANSACTIONS</button>
      <ul>
        {transactionList.map((transaction) => (
          <ul>
            <li>
              <button
                onClick={() => {
                  showQR(transaction);
                }}
              >
                SHOW QR
              </button>
              {transaction.items[0].map((trans) => (
                <li>
                  {trans[1]} AND {trans[2]}
                </li>
              ))}{" "}
              END
            </li>
          </ul>
        ))}
      </ul>
      {isQr && (
        <QRCode
          size={256}
          style={{
            padding: "10%",
            height: "auto",
            maxWidth: "30%",
            width: "30%",
          }}
          value={qrValue}
          viewBox={`0 0 256 256`}
        />
      )}
    </>
  );
}

export default VendorTransactions;
