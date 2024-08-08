import React, { useState } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import ReactJson from 'react-json-view';
import { TonProofDemoApi } from "../../TonProofDemoApi";
import './style.scss';

export const CreateJettonDemo = () => {
	const [data, setData] = useState({});
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		image_data: '',
		symbol: '',
		decimals: 0,
		amount: '',
	});
	const [tonConnectUI] = useTonConnectUI();
	const wallet = useTonWallet();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleClick = async () => {
		try {
			console.log(wallet);
			if (!wallet?.account.publicKey) {
				throw new Error('No auth token found. Please connect your wallet.');
			}
			const response = await TonProofDemoApi.createJetton(formData);
			setData(response);

			if (!('error' in response)) {
				await tonConnectUI.sendTransaction(response);
			}
		} catch (error) {
			console.error('Error creating jetton:', error);
		}
	};

	return (
		<div className="create-jetton-demo">
			<h3>Create Jetton</h3>
			<input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
			<input name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
			<input name="image_data" value={formData.image_data} onChange={handleChange} placeholder="Image Data" />
			<input name="symbol" value={formData.symbol} onChange={handleChange} placeholder="Symbol" />
			<input name="decimals" value={formData.decimals} onChange={handleChange} placeholder="Decimals" />
			<input name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" />
			{wallet ? (
				<button onClick={handleClick}>Send create jetton</button>
			) : (
				<div className="ton-proof-demo__error">Connect wallet to send transaction</div>
			)}
			<div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', maxWidth: '100%', overflow: 'hidden' }}>
				<ReactJson src={data} name="response" theme="ocean" />
			</div>
		</div>
	);
};