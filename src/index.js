/* import css files here is not working on CodeSandbox - icons are missing;
 * if styles are in a diferent named folder than "public";
 */

import "./public/bit-variables.css";
//import "./public/dx.generic.light-org.css";
import "./public/dx.generic.light-customized-for-bit.css";
import "./public/bit-dx.over-customizations.css";
import "./public/demo.panel.settings.css";

import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

ReactDOM.render(<App />, document.getElementById("app"));
