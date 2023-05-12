import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import { get, isEmpty } from 'lodash';
// import logo from './logo.svg';
import './App.css';
import Router from './router';

import { setNetwork, setUserAccounts, updateUserBalance } from './redux/actions/user';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      if (window.ethereum) {
          window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
              if (isEmpty(accounts)) {
                  dispatch(setUserAccounts({ accounts: [], balance: 0, ris3Balance: 0 }));
              } else {
                  dispatch(setUserAccounts({ accounts }));
                  dispatch(updateUserBalance(accounts));
              }
          });

          window.ethereum.request({ method: 'eth_chainId' }).then((chainId) => {
              // Set network when first time enter page
              dispatch(setNetwork(chainId));
          });
      }

      window.ethereum && window.ethereum.on('accountsChanged', (accounts) => {
          const isFortmatic = get(window, 'web3.currentProvider.isFortmatic');
          if (isFortmatic) {
              return;
          }

          dispatch(setUserAccounts({ accounts }));
          if (!isEmpty(accounts)) {
              dispatch(updateUserBalance(accounts));
          }
      });

      window.ethereum && window.ethereum.on('chainChanged', async (chainId) => {
          dispatch(setNetwork(chainId));

          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          let balance;

          if (!isEmpty(accounts)) {
              balance = await web3.eth.getBalance(accounts[0]);
              dispatch(updateUserBalance(accounts));
          }

          dispatch(setUserAccounts({ chainId, balance }));
      });
  });

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        
      </header> */}
      <Router/>
    </div>
  );
}

export default App;
