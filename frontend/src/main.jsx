import React from 'react'
import ReactDOM from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import App from "./App"
import './global.css'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import {
  BrowserRouter,
} from "react-router-dom";

import {
  Provider,
} from "react-redux";

import { store } from "./store/store";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
);