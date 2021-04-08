import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Hidden from "@material-ui/core/Hidden";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
// @material-ui/icons components
import DirectionsRun from "@material-ui/icons/DirectionsRun";
import EventNote from "@material-ui/icons/EventNote";
import LiveHelp from "@material-ui/icons/LiveHelp";
import Person from "@material-ui/icons/Person";
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { useEagerConnect } from '../../hooks/useEagerConnect'
import { useInactiveListener } from '../../hooks/useInactiveListener'
import { Networks, shorter, TOKENS_BY_NETWORK } from '../../utils'
import useEtherSWR, { EthSWRConfig } from 'ether-swr'
import { formatEther, formatUnits } from '@ethersproject/units'
import HappyDAOABI from "../../../contracts/localhost/HappyDao.json";
import HappyTokenABI from "../../../contracts/localhost/HappyToken.json";

// core components
import componentStyles from "../../assets/theme/components/navbar-dropdown.js";

const useStyles = makeStyles(componentStyles);

const ABIs = [
  [HappyDAOABI.address, HappyDAOABI.abi],
  [HappyTokenABI.address, HappyTokenABI.abi]
]

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    Networks.MainNet, // Mainet
    Networks.Ropsten, // Ropsten
    Networks.Rinkeby, // Rinkeby
    Networks.Goerli, // Goerli
    Networks.Kovan, // Kovan
    Networks.Hardhat// Kovan
  ],
})

export default function NavbarDropdown() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleConnect = () => {
    activate(injectedConnector)
  }

  const {
    chainId,
    account,
    library,
    activate,
    active,
    connector,
  } = useWeb3React()

  const menuId = "primary-search-account-menu";
  const renderNav = (account) => {
    return(
    <>
    <Button
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
        classes={{
          label: classes.buttonLabel,
          root: classes.buttonRoot,
        }}
        >
        <Avatar
          alt="..."
          src={require("../../assets/img/theme/team-4-800x800.jpg").default}
          classes={{
            root: classes.avatarRoot,
          }}
        />
        <Hidden smDown>{account}</Hidden>
      </Button>
      <ProfileMenu />
    </>);
  }

  const ProfileMenu = () => {
    const { data: balance } = useEtherSWR(['getBalance', account, 'latest'])

    return(
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Typography
        variant="h6"
        component="h6"
        classes={{ root: classes.menuTitle }}
      >
        Welcome!
      </Typography>
      <Box
        display="flex!important"
        alignItems="center!important"
        component={MenuItem}
        onClick={handleMenuClose}
      >
        <Box
          component={Person}
          width="1.25rem!important"
          height="1.25rem!important"
          marginRight="1rem"
        />
        <span>My profile</span>
      </Box>
          <Box
        display="flex!important"
        alignItems="center!important"
        component={MenuItem}
        onClick={handleMenuClose}
      >
        <Box
          width="1.25rem!important"
          height="1.25rem!important"
          marginRight="1rem"
        />
        <span>{balance && parseFloat(formatEther(balance)).toPrecision(4)} Ξ</span>
      </Box>
    </Menu>);
  }

  const renderConnectButton = (
    <Button
      variant="contained"
      size="medium"
      classes={{ root: classes.buttonRootInfo }}
      onClick={handleConnect}
    >
      Connect
    </Button>
  );

  return (
    <>
    {active && chainId ? (
        <EthSWRConfig
          value={{ provider: library, ABIs: new Map(ABIs), refreshInterval: 30000 }}
        >
      
      {renderNav(shorter(account))}
      </EthSWRConfig>
    )
      : (<>{renderConnectButton}</>)}
    </>
  );
}
