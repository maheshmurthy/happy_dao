import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import { ethers } from "ethers";
import useSWR from "swr";
import React, {useEffect, useState} from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";

import {Contract} from "@ethersproject/contracts";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import LocationOn from "@material-ui/icons/LocationOn";
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import { Wallet } from './Wallet'
import componentStyles from "../assets/theme/components/card-stats.js";
import useEtherSWR, { EthSWRConfig } from 'ether-swr'
import HappyDAOABI from "../../contracts/localhost/HappyDao.json";
import HappyTokenABI from "../../contracts/localhost/HappyToken.json";
import { formatEther, formatUnits } from '@ethersproject/units'
import { Networks, ContractAddress } from '../utils';

const useStyles = makeStyles(componentStyles);

export const DAOContract = () => {
  const {account, library, chainId} = useWeb3React<Web3Provider>()
  const [proposalCount, setproposalCount] = useState(null);
  const [treasuryBalance, setTreasuryBalance] = useState(0);

  const classes = useStyles();
  const theme = useTheme();

  const contractAddresses = ContractAddress(chainId);
  useEffect(() => {
    if (!!library) {
      const contract = new Contract(contractAddresses.HappyDao, HappyDAOABI.abi, library.getSigner())
      contract.totalProposals().then((value) => {
        setproposalCount(value.toNumber());
      });
      library.getBalance(contractAddresses.HappyDao).then((value) => {
        setTreasuryBalance(parseFloat(formatUnits(value)).toPrecision(4));
      })
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
                Happy DAO 
              </Box>
              <Box
                component={Typography}
                variant="h2"
                fontWeight="600!important"
                marginTop="0!important"
              >
                {contractAddresses ? contractAddresses.HappyDao : ''}
              </Box>
              <Box
                component={Divider}
                marginBottom="1.5rem!important"
                marginTop="1.5rem!important"
              />
              <Box>
                <Typography variant="h4">
                  Total Proposals:
                  <Box component="span" marginLeft="1em">
                    {proposalCount}
                  </Box>
                </Typography>
              </Box>

              <Box>
                <Typography variant="h4">
                  Treasury Balance:
                  <Box component="span" marginLeft="1em">
                    {treasuryBalance} Ξ
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
