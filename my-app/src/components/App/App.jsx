import React, { useState, useEffect } from "react";
import TronWeb from "tronweb";
import Header from "../Header/Header";
import Customer from "../Customer/Customer";
import Treasury from "../Treasury/Treasury";
import "./App.css";

const App = () => {
  const [address, setAddress] = useState("");
  const [tronWeb, setTronWeb] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const connectTronLink = async () => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        setTronWeb(window.tronWeb);
        setAddress(window.tronWeb.defaultAddress.base58);
        determineUserType(window.tronWeb.defaultAddress.base58);
      } else {
        setTimeout(connectTronLink, 500);
      }
    };
    connectTronLink();
  }, []);

  const determineUserType = async (address) => {
    // Replace this logic with the actual user type determination logic based on the connected wallet's status.
    // For now, let's assume that the connected wallet is a customer by default.
    setUserType("customer");
  };

  return (
    <div className="app">
      <Header />
      {userType === "customer" && <Customer />}
      {userType === "treasury" && <Treasury />}
    </div>
  );
};

export default App;
