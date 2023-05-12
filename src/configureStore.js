import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { connectRouter } from 'connected-react-router';

import rootReducer from './redux/reducers';

const createHistory = require('history');

function configureStoreProd(initialState = {}) {
  const history = createHistory.createBrowserHistory();
  const middleware = [thunk];

  const store = createStore(
    combineReducers({
      ...rootReducer,
      router: connectRouter(history)
    }),
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
  );

  const persistor = persistStore(store);

  return { store, persistor, history };
}

function configureStoreDev(initialState = {}) {
  const history = createHistory.createBrowserHistory();
  const middleware = [thunk];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    combineReducers({
      ...rootReducer,
      router: connectRouter(history)
    }),
    initialState,
    composeEnhancers(
      applyMiddleware(...middleware)
    )
  );

  const persistor = persistStore(store);

  return { store, persistor, history };
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
