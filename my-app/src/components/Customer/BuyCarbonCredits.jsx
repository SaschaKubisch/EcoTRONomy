// BuyCarbonCredits.jsx
import React, { useState } from "react";
// Remove the following line
// import web3 from '../../utils/web3Config';
// Add the following line
import tronWeb from "../../utils/tronWeb";
import { marketplace } from "../../utils/contracts";
import "./BuyCarbonCredits.css";

const BuyCarbonCredits = () => {
  const [tokenId, setTokenId] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("trx");

  const buyCarbonCredits = async (e) => {
    e.preventDefault();
  
    try {
      const tx = await marketplace.buyListing(
        tokenId,
        amount
      ).send({
        // Replace the following line
        // value: web3.utils.toWei(paymentMethod === "trx" ? "1" : "0", "ether")
        callValue: paymentMethod === "trx" ? tronWeb.toSun("1") : tronWeb.toSun("0")
      });
      alert("Successfully bought carbon credits!");
    } catch (err) {
      console.error(err);
      alert("Failed to buy carbon credits.");
    }
  };


  return (
    <div className="buy-carbon-credits">
      <h2>Buy Carbon Credits</h2>
      <form onSubmit={buyCarbonCredits}>
        <label htmlFor="tokenId">Token ID:</label>
        <input
          type="number"
          id="tokenId"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <label htmlFor="paymentMethod">Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="trx">TRX</option>
          <option value="usdt">USDT</option>
        </select>

        <button type="submit">Buy Credits</button>
      </form>
    </div>
  );
};

export default BuyCarbonCredits;
