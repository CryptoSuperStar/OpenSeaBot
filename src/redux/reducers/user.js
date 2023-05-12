import { isEmpty, get, has } from 'lodash';
import { handleActions } from 'redux-actions';

const initialState = {
  connectWallet: {
    error: null,
    isConnect: false,
    requesting: false,
  },
  userAccount: {
    balance: 0,
    accounts: [],
    error: null,
    requesting: false,
  },
  chainId: '',
  explorerUrl: 'https://ropsten.etherscan.io',
  seaport: null,
  transactionLogs: {
    result: [],
  }
};

const user = handleActions({
  SET_NETWORK: (state, { payload }) => ({
    ...state,
    chainId: payload,
  }),

  /** SET USER ACCOUNTS **/
  SET_USER_ACCOUNTS: (state, { payload }) => ({
    ...state,
    userAccount: {
      ...state.userAccount,
      accounts: has(payload, 'accounts') ? payload.accounts : state.userAccount.accounts,
      balance: has(payload, 'balance') ? payload.balance : state.userAccount.balance,
    },
    connectWallet: {
      ...state.connectWallet,
      ...{ isConnect: !isEmpty(payload.accounts) },
    },
    chainId: has(payload, 'chainId') ? payload.chainId : state.chainId,
    seaport: has(payload, 'seaport') ? payload.seaport : state.seaport
    // explorerUrl: has(payload, 'explorerUrl') ? payload.explorerUrl : state.explorerUrl
  }),

  /** CONNECT WALLET **/
  CONNECT_WALLET_REQUEST: (state) => ({
    ...state,
    connectWallet: {
      ...state.connectWallet,
      requesting: true,
    },
  }),
  CONNECT_WALLET_SUCCESS: (state) => ({
    ...state,
    connectWallet: {
      ...state.connectWallet,
      requesting: false,
      isConnect: true,
      error: null,
    },
  }),
  CONNECT_WALLET_FAIL: (state, { payload }) => ({
    ...state,
    connectWallet: {
      ...state.connectWallet,
      requesting: false,
      error: payload.error,
    },
  }),

  
  /* CLEAR TRANSACTION LOGS */
  CLEAR_TRANSACTION_LOGS: (state, { payload }) => ({
    ...state,
    transactionLogs: {
      result: payload,
    },
  }),

  /* STORE TRANSACTION LOG */
  STORE_TRANSACTION_LOG: (state, { payload }) => ({
    ...state,
    transactionLogs: {
      result: [
        ...get(state, 'transactionLogs.result', []),
        payload,
      ],
    },
  }),

}, initialState);

export default user;

