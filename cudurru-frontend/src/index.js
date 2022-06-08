import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter as Router} from "react-router-dom";
import "@babel/polyfill";

import App from "./App";


ReactDOM.render(<Router><App /></Router>, window.document.getElementById("root"));