import React, { useState } from 'react';
import './OffsetCarbonFootprint.css';
import web3 from '../../utils/web3Config';
import { Offset } from '../../contracts/Offset.json';

const OffsetCarbonFootprint = () => {
    const { account } = web3();
    const [tokenId, setTokenId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const offset = new window.web3.eth.Contract(Offset.abi, Offset.address);
            await offset.methods.offsetCarbonCredits(account, tokenId, amount).send({ from: account });
        } catch (error) {
            console.error('Error offsetting carbon credits:', error);
        }
    };

    return (
        <div className="offset-carbon-footprint">
            <h2>Offset Carbon Footprint</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="tokenId">Token ID</label>
                <input
                    type="number"
                    id="tokenId"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                />
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Offset Carbon Credits</button>
            </form>
        </div>
    );
};

export default OffsetCarbonFootprint;
