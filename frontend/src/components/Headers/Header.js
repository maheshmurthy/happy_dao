import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
// @material-ui/icons components
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import EmojiEvents from "@material-ui/icons/EmojiEvents";
import GroupAdd from "@material-ui/icons/GroupAdd";
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import PieChart from "@material-ui/icons/PieChart";
import { DAOContract } from '../DAOContract'
import { TokenContract } from '../TokenContract'
import useEtherSWR, { EthSWRConfig } from 'ether-swr'
import HappyDAOABI from "../../../contracts/localhost/HappyDao.json";
import HappyTokenABI from "../../../contracts/localhost/HappyToken.json";
import { useWeb3React } from '@web3-react/core'

// core components
import CardStats from "../Cards/CardStats.js";

import componentStyles from "../../assets/theme/components/header.js";

const useStyles = makeStyles(componentStyles);

const Header = () => {
  const { chainId, account, library, activate, active } = useWeb3React()
  
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <div className={classes.header}>
        <Container
          maxWidth={false}
          component={Box}
          classes={{ root: classes.containerRoot }}
        >
          <div>
            <Grid container>
              <Grid item xl={6} lg={6} xs={12}>
                <DAOContract />
              </Grid>
              <Grid item xl={6} lg={6} xs={12}>
                <TokenContract />
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
