// index.tsx
import React from 'react'
import ReactDOM from 'react-dom'

import {App} from "./components/App";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./assets/theme/theme.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "./layouts/Auth.js";
import AdminLayout from "./layouts/Admin.js";

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

ReactDOM.render(
    <Web3ReactProvider getLibrary={getLibrary}>
      <App/> 
    </Web3ReactProvider>,
  document.querySelector("#root")
);

