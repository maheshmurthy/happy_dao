import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import useSWR from "swr";
import React, {useEffect, useState} from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";

import {Contract} from "@ethersproject/contracts";
import HappyTokenABI from "../../contracts/localhost/HappyToken.json";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";

import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import { Wallet } from './Wallet'
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import componentStyles from "../assets/theme/components/card-stats.js";
import { ContractAddress } from '../utils';
const useStyles = makeStyles(componentStyles);

export const TokenContract = () => {
  const {account, library, chainId} = useWeb3React<Web3Provider>()
  const [tokenSupply, setTokenSupply] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(null);

  const classes = useStyles();
  const theme = useTheme();
  const contractAddresses = ContractAddress(chainId);

  useEffect(() => {
    if (!!library) {
      const contract = new Contract(contractAddresses.HappyToken, HappyTokenABI.abi, library.getSigner())
      contract.totalSupply().then((value) => {
        setTokenSupply(value.toNumber());
      });

      contract.balanceOf(account).then((value) => {
        setTokenBalance(value.toNumber());
      });
    }
  });

  return (
    <>
      <Card classes={{ root: classes.cardRoot }} elevation={0}>
        <CardContent classes={{ root: classes.cardContentRoot }}>
          <Grid container component={Box} justifyContent="space-between">
            <Grid item xs="auto">
              <Box
                component={Typography}
                variant="h5"
                color={theme.palette.gray[600] + "!important"}
                marginBottom="0!important"
                marginTop="0!important"
                className={classes.textUppercase}
              >
                Happy Token 
              </Box>
              <Box
                component={Typography}
                variant="h2"
                fontWeight="600!important"
                marginTop="0!important"
              >
                {contractAddresses ? contractAddresses.HappyToken : ''}
              </Box>
              <Box
                component={Divider}
                marginBottom="1.5rem!important"
                marginTop="1.5rem!important"
              />
              <Box>
                <Typography variant="h4">
                  Token Supply:
                  <Box component="span" marginLeft="1em">
                    {tokenSupply}
                  </Box>
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4">
                  My Balance:
                  <Box component="span" marginLeft="1em">
                    {tokenBalance}
                  </Box>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
