import localForage from 'localforage';
import user from './user';
import { persistReducer } from 'redux-persist';


// const commonConfig = {
//   key: 'common',
//   storage: localForage,
//   whitelist: []
// };

const userConfig = {
  key: 'user',
  storage: localForage,
  whitelist: []
};

const reducer = {
  user: persistReducer(userConfig, user)
};

export default reducer;
