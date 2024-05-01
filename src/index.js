import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
 
const my_root = ReactDOM.createRoot(document.getElementById('root'))

my_root.render(
  <BrowserRouter>
   <App/>
  </BrowserRouter>
)