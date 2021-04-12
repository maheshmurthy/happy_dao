import React from 'react'
import ReactDOM from 'react-dom'

import {App} from "./components/App";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "../assets/theme/theme.js";
import CssBaseline from "@material-ui/core/CssBaseline";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "../layouts/Auth.js";
import AdminLayout from "../layouts/Admin.js";

import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { useEagerConnect } from '../hooks/useEagerConnect'
import { useInactiveListener } from '../hooks/useInactiveListener'
import {history} from '../helpers/history.js'

export const App = () => {
  const context = useWeb3React<Web3Provider>()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
        <Router history={history}
               basename={process.env.PUBLIC_URL}>
          <Switch>
            <Route path="/admin/index" render={(props) => <AdminLayout {...props} />} />
            <Route path="/" render={(props) => <AuthLayout {...props} />} />
          </Switch>
        </Router>
  </ThemeProvider>
  )
}

