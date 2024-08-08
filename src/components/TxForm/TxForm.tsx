import { useState } from 'react';
import ReactJson from 'react-json-view';
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import './style.scss';

const defaultTx = {
  validUntil: Math.floor(Date.now() / 1000) + 600,
  messages: [
    {
      address: '',
      amount: '',
      stateInit: '',
      payload: '',
    },
  ],
};

export function TxForm() {
  const [tx, setTx] = useState<SendTransactionRequest>(defaultTx);
  const wallet = useTonWallet();
  const [tonConnectUi] = useTonConnectUI();

  const handleChange = (value: any) => {
    setTx(value?.updated_src as SendTransactionRequest);
  };

  const handleSubmit = async () => {
    try {
      console.log('Sending transaction:', tx);
      await tonConnectUi.sendTransaction(tx);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  return (
      <div className="send-tx-form">
        <h3>Configure and send transaction</h3>
        <ReactJson theme="ocean" src={tx} onEdit={handleChange} onAdd={handleChange} onDelete={handleChange} />
        {wallet ? (
            <button onClick={handleSubmit}>Send transaction</button>
        ) : (
            <button onClick={() => tonConnectUi.openModal()}>Connect wallet to send the transaction</button>
        )}
      </div>
  );
}