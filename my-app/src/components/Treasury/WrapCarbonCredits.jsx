import React, { useState } from 'react';
// import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import web3 from '../../utils/web3Config';
import './WrapCarbonCredits.css';
import { useWeb3React } from '@web3-react/core';


const WrapCarbonCredits = () => {
    const { account, library } = useWeb3React();
    const [amount, setAmount] = useState('');

    const wrapCarbonCredits = async () => {
        if (!account) return;

        const parsedAmount = ethers.utils.parseUnits(amount, 18);
        const treasuryContract = new ethers.Contract(wrappedBCTAddress, treasuryABI, library.getSigner());
        try {
            const tx = await treasuryContract.wrap(parsedAmount, { from: account });
            await tx.wait();
            alert('Carbon credits wrapped successfully!');
        } catch (error) {
            console.error('Error wrapping carbon credits:', error);
        }
    };

    return (
        <div className="wrap-carbon-credits">
            <h2>Wrap Carbon Credits</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    wrapCarbonCredits();
                }}
            >
                <label htmlFor="wrapAmount">Amount to Wrap:</label>
                <input
                    type="number"
                    id="wrapAmount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.000000000000000001"
                />
                <button type="submit">Wrap</button>
            </form>
        </div>
    );
};

export default WrapCarbonCredits;
