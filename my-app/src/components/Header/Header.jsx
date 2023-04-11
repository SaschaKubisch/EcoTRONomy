import React, { useState, useEffect } from "react";
import TronWeb from "tronweb";
import SellCarbonCredits from '../Customer/SellCarbonCredits/SellCarbonCredits';
import "./Header.css";

const Header = () => {
  const [address, setAddress] = useState("");
  const [tronWeb, setTronWeb] = useState(null);

  useEffect(() => {
    const connectTronLink = async () => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        setTronWeb(window.tronWeb);
        setAddress(window.tronWeb.defaultAddress.base58);
      } else {
        setTimeout(connectTronLink, 500);
      }
    };
    connectTronLink();
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Carbon Credits Marketplace</h1>
        <div className="wallet-status">
          {address ? (
            <span>
              Connected: <span className="wallet-address">{address}</span>
            </span>
          ) : (
            <span>Connecting to TronLink...</span>
          )}
        </div>
      </div>
      <SellCarbonCredits userAddress={address} />
    </header>
  );
};

export default Header;
