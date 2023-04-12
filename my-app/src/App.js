import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header/Header';
import BuyCarbonCredits from './components/Customer/BuyCarbonCredits';
import SellCarbonCredits from './components/Customer/SellCarbonCredits';
import OffsetCarbonFootprint from './components/Customer/OffsetCarbonFootprint';
import WrapCarbonCredits from './components/Treasury/WrapCarbonCredits';
import BridgeCarbonCredits from './components/Treasury/BridgeCarbonCredits';

import tronWeb from './utils/web3Config';


function App() {
  const [connected, setConnected] = useState(false);
  const [userType, setUserType] = useState('customer');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (tronWeb && tronWeb.ready) {
      setAddress(tronWeb.defaultAddress.base58);
      setConnected(true);
      // Replace the 'checkIfTreasury()' function with the actual function to check if the address is a treasury.
      checkIfTreasury(address).then((isTreasury) => {
        if (isTreasury) {
          setUserType('treasury');
        }
      });
    }
  }, [address]);

  // Replace this with the actual function to check if the address is a treasury.
  const checkIfTreasury = async (address) => {
    // TODO: Check if the address is a treasury
    return true;
  };

  return (
    <div className="App">
      <Header connected={connected} />
      {userType === 'customer' ? (
        <main>
          <BuyCarbonCredits />
          <SellCarbonCredits />
          <OffsetCarbonFootprint />
        </main>
      ) : (
        <main>
          <WrapCarbonCredits />
          <BridgeCarbonCredits />
        </main>
      )}
    </div>
  );
}

export default App;
