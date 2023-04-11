import React, { useState } from 'react';
// import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { bridgeABI, bridgeAddress } from '../../web3config';
import './BridgeCarbonCredits.css';

const BridgeCarbonCredits = () => {
    const { account, library } = useWeb3React();
    const [wrapperAddress, setWrapperAddress] = useState('');
    const [amount, setAmount] = useState('');

    const bridgeCarbonCredits = async () => {
        if (!account) return;

        const parsedAmount = ethers.utils.parseUnits(amount, 18);
        const bridgeContract = new ethers.Contract(bridgeAddress, bridgeABI, library.getSigner());
        try {
            const tx = await bridgeContract.bridge(wrapperAddress, parsedAmount, { from: account });
            await tx.wait();
            alert('Carbon credits bridged successfully!');
        } catch (error) {
            console.error('Error bridging carbon credits:', error);
        }
    };

    return (
        <div className="bridge-carbon-credits">
            <h2>Bridge Carbon Credits</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    bridgeCarbonCredits();
                }}
            >
                <label htmlFor="wrapperAddress">Wrapper Address:</label>
                <input
                    type="text"
                    id="wrapperAddress"
                    value={wrapperAddress}
                    onChange={(e) => setWrapperAddress(e.target.value)}
                />
                <label htmlFor="bridgeAmount">Amount to Bridge:</label>
                <input
                    type="number"
                    id="bridgeAmount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.000000000000000001"
                />
                <button type="submit">Bridge</button>
            </form>
        </div>
    );
};

export default BridgeCarbonCredits;
