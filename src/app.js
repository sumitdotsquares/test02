import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers";
import "./app.scss";
import SearchBar from "./components/SearchBar";
import "@babel/polyfill";

ReactDOM.render(
  <Provider store={createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())}>
    <SearchBar />
  </Provider>,
  document.getElementById("solm_affiliate_card")
);
