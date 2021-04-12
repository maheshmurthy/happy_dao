import React, {useEffect, useState} from "react";
// javascipt plugin for creating charts
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Container from "@material-ui/core/Container";
import FilledInput from "@material-ui/core/FilledInput";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
// @material-ui/icons components
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import {useWeb3React} from "@web3-react/core";
import {Contract} from "@ethersproject/contracts";
import HappyDAOABI from "../../../contracts/localhost/HappyDao.json";
import { ethers } from "ethers";
import Proposals from "../../components/Proposals.js";

import { ContractAddress } from '../../utils';
// core components
import Header from "../../components/Headers/Header.js";

import componentStyles from "../../assets/theme/views/admin/dashboard.js";

const useStyles = makeStyles(componentStyles);

function Dashboard() {
  const classes = useStyles();
  const theme = useTheme();
  const [ethValue, setEthValue] = useState('');
  const [ethRequested, setEthRequested] = useState('');
  const [proposalText, setProposalText] = useState('');
  const [applicant, setApplicant] = useState('');

  const {account, library, chainId} = useWeb3React();

  const contractAddresses = ContractAddress(chainId);

  const onJoinChange = (event) => {
    setEthValue(event.target.value);
  };

  const onProposalTextChange = (event) => {
    setProposalText(event.target.value);
  };

  const onApplicantChange = (event) => {
    setApplicant(event.target.value);
  };

  const onProposalEthChange = (event) => {
    setEthRequested(event.target.value);
  };
  
  const handleJoinDAO = () => {
    if (!!library) {
      const contract = new Contract(contractAddresses.HappyDao, HappyDAOABI.abi, library.getSigner())
      contract.join({value: ethers.utils.parseEther(ethValue)}).then(() => {
        console.log("Joining ...");
      });
    }
  }

  const handleSubmitProposal = () => {
    if (!!library) {
      const contract = new Contract(contractAddresses.HappyDao, HappyDAOABI.abi, library.getSigner())
      contract.submitProposal(proposalText, applicant, ethers.utils.parseEther(ethRequested)).then(() => {
        console.log("Submitting Proposal ...");
      });
    }
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container
        maxWidth={false}
        component={Box}
        marginTop="-6rem"
        classes={{ root: classes.containerRoot }}
      >
        <Grid container component={Box} marginTop="3rem">
          <Grid
            item
            xs={12}
            xl={4}
            component={Box}
            marginBottom="3rem"
            classes={{ root: classes.gridItemRoot + " " + classes.order2 }}
          >
            <Card
              classes={{
                root: classes.cardRoot + " " + classes.cardRootSecondary,
              }}
            >
              <CardHeader
                subheader={
                  <Grid
                    container
                    component={Box}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs="auto">
                      <Box
                        component={Typography}
                        variant="h3"
                        marginBottom="0!important"
                      >
                        Join DAO
                      </Box>
                    </Grid>
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
              ></CardHeader>
              <CardContent>
                <div className={classes.plLg4}>
                  <Grid container>
                    <Grid item xs={12} lg={6}>
                      <FormGroup>
                        <FormLabel>Amount in ETH</FormLabel>
                        <FormControl
                          variant="filled"
                          component={Box}
                          width="100%"
                          marginBottom="1rem!important"
                        >
                          <Box
                            paddingLeft="0.75rem"
                            paddingRight="0.75rem"
                            component={FilledInput}
                            autoComplete="off"
                            type="text"
                            onChange={onJoinChange}
                          />
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <Button
                          onClick={handleJoinDAO}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Join
                        </Button>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
            <Box mt={2}>
            <Card
              classes={{
                root: classes.cardRoot + " " + classes.cardRootSecondary,
              }}
            >
              <CardHeader
                subheader={
                  <Grid
                    container
                    component={Box}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs="auto">
                      <Box
                        component={Typography}
                        variant="h3"
                        marginBottom="0!important"
                      >
                        Submit Proposal
                      </Box>
                    </Grid>
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
              ></CardHeader>
              <CardContent>
                <div className={classes.plLg4}>
                  <Grid container>
                    <Grid item xs={12} lg={12}>
                      <FormGroup>
                        <FormLabel>Proposal</FormLabel>
                        <FormControl
                          variant="filled"
                          component={Box}
                          width="100%"
                          marginBottom="1rem!important"
                        >
                          <Box
                            paddingLeft="0.75rem"
                            paddingRight="0.75rem"
                            component={FilledInput}
                            autoComplete="off"
                            type="text"
                            onChange={onProposalTextChange}
                          />
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <FormGroup>
                        <FormLabel>Applicant</FormLabel>
                        <FormControl
                          variant="filled"
                          component={Box}
                          width="100%"
                          marginBottom="1rem!important"
                        >
                          <Box
                            paddingLeft="0.75rem"
                            paddingRight="0.75rem"
                            component={FilledInput}
                            autoComplete="off"
                            type="text"
                            onChange={onApplicantChange}
                          />
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <FormGroup>
                        <FormLabel>Amount Requested</FormLabel>
                        <FormControl
                          variant="filled"
                          component={Box}
                          width="100%"
                          marginBottom="1rem!important"
                        >
                          <Box
                            paddingLeft="0.75rem"
                            paddingRight="0.75rem"
                            component={FilledInput}
                            autoComplete="off"
                            type="text"
                            onChange={onProposalEthChange}
                          />
                        </FormControl>
                      </FormGroup>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <Button
                          onClick={handleSubmitProposal}
                          variant="contained"
                          color="primary"
                          size="small"
                        >
                          Submit Proposal
                        </Button>
                    </Grid>
                  </Grid>
                </div>
              </CardContent>
            </Card>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            xl={8}
            component={Box}
            marginBottom="3rem!important"
            classes={{ root: classes.gridItemRoot }}
          >
            <Card
              classes={{
                root: classes.cardRoot,
              }}
            >
              <CardHeader
                subheader={
                  <Grid
                    container
                    component={Box}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs="auto">
                      <Box
                        component={Typography}
                        variant="h3"
                        marginBottom="0!important"
                      >
                        Proposals
                      </Box>
                    </Grid>
                  </Grid>
                }
                classes={{ root: classes.cardHeaderRoot }}
              ></CardHeader>
              <TableContainer>
                <Box
                  component={Table}
                  alignItems="center"
                  marginBottom="0!important"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        classes={{
                          root:
                            classes.tableCellRoot +
                            " " +
                            classes.tableCellRootHead,
                        }}
                      >
                        Proposal
                      </TableCell>
                      <TableCell
                        classes={{
                          root:
                            classes.tableCellRoot +
                            " " +
                            classes.tableCellRootHead,
                        }}
                      >
                        Applicant 
                      </TableCell>
                      <TableCell
                        classes={{
                          root:
                            classes.tableCellRoot +
                            " " +
                            classes.tableCellRootHead,
                        }}
                      >
                        Amount
                      </TableCell>
                      <TableCell
                        classes={{
                          root:
                            classes.tableCellRoot +
                            " " +
                            classes.tableCellRootHead,
                        }}
                      >
                        Yes
                      </TableCell>
                      <TableCell
                        classes={{
                          root:
                            classes.tableCellRoot +
                            " " +
                            classes.tableCellRootHead,
                        }}
                      >
                        No
                      </TableCell>
                      <TableCell
                        classes={{
                          root:
                            classes.tableCellRoot +
                            " " +
                            classes.tableCellRootHead,
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <Proposals />
                  </TableBody>
                </Box>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;
