import Web3 from 'web3';
import { createAction, createActions } from 'redux-actions';
import detectEthereumProvider from '@metamask/detect-provider';
import BigNumber from 'bignumber.js';
import { get, isArray } from 'lodash';
import { OpenSeaPort, Network } from 'opensea-js'

// import Api from '../api';
// import Abi from '../../resources/abi';
// import { getExplorerUrl, tokenRootSymbols, claimContractAddress } from '../../utils';


/** SET NETWORK **/
export const setNetwork = createAction('SET_NETWORK');

/** SET USER ACCOUNTS **/
export const setUserAccounts = createAction('SET_USER_ACCOUNTS');

/** CONNECT TO METAMASK **/
const { connectWalletRequest, connectWalletSuccess, connectWalletFail } = createActions({
  CONNECT_WALLET_REQUEST: () => { },
  CONNECT_WALLET_SUCCESS: data => ({ data }),
  CONNECT_WALLET_FAIL: error => ({ error })
});

export const addTokenToMetamask = (tokenAddress, tokenSymbol, tokenDecimals) => {
  return window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals
        // image: tokenImage,
      }
    }
  });
};

export const connectMetamask = () => async (dispatch) => {
  dispatch(connectWalletRequest());

  // Check metamask is install or not
  if (window.ethereum) {
    const provider = await detectEthereumProvider();
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      window.web3 = new Web3(provider);
    } else {
      window.web3 = new Web3(window.ethereum);
    }

    return window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(async () => {
        const chainId = window.ethereum.chainId;
        // const explorerUrl = getExplorerUrl(chainId);
        const accounts = await window.web3.eth.getAccounts();
        const balance = await window.web3.eth.getBalance(accounts[0]);
        console.log("process.env.REACT_APP_OPENSEA_API_KEY: ", process.env.REACT_APP_OPENSEA_API_KEY);
        const seaport = new OpenSeaPort(provider, {
          networkName: Network.Rinkeby,
          apiKey: process.env.REACT_APP_OPENSEA_API_KEY
        });

        dispatch(connectWalletSuccess());
        dispatch(setUserAccounts({ accounts, balance, chainId, seaport }));
      })
      .catch((error) => {
        dispatch(connectWalletFail(error));
      });
  }

  return new Promise((resolve, reject) => {
    const err = 'Metamask not install.';

    resolve(err);
    return dispatch(connectWalletFail(err));
  });
};

/** UPDATE USER BALANCE **/
export const updateUserBalance = (accounts) => async (dispatch) => {
  window.web3 = new Web3(window.web3.currentProvider);

  const balance = await window.web3.eth.getBalance(isArray(accounts) ? accounts[0] : accounts);
  dispatch(setUserAccounts({ balance }));
};

