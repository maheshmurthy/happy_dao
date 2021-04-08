import React, {useEffect, useState} from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import {useWeb3React} from "@web3-react/core";
import componentStyles from "../assets/theme/views/admin/dashboard.js";
import {Contract} from "@ethersproject/contracts";
import HappyDAOABI from "../../contracts/localhost/HappyDao.json";
import {  shorter } from '../utils'

const useStyles = makeStyles(componentStyles);

const Proposal = (props) => {
  const [proposal, setProposal] = useState({});
  const classes = props.classes;
  useEffect(() => {
    props.contract.getProposal(props.index).then((proposal) => {
      console.log(proposal);
      setProposal(proposal);
    });
  }, []);
  return(
    <TableRow key={props.index}>
    <TableCell
      classes={{
        root:
          classes.tableCellRoot +
          " " +
          classes.tableCellRootBodyHead,
      }}
      component="th"
      variant="head"
      scope="row"
    >
      {proposal.text}
    </TableCell>
    <TableCell classes={{ root: classes.tableCellRoot }}>
      {shorter(proposal.applicant)}
    </TableCell>
    <TableCell classes={{ root: classes.tableCellRoot }}>
      {shorter(proposal.proposer)}
    </TableCell>
    <TableCell classes={{ root: classes.tableCellRoot }}>
      {proposal.yesVotes ? proposal.yesVotes.toString() : 0}
    </TableCell>
    <TableCell classes={{ root: classes.tableCellRoot }}>
      {proposal.noVotes ? proposal.noVotes.toString() : 0}
    </TableCell></TableRow>
  );
};

const Proposals = () => {
  const classes = useStyles();
  const {account, library} = useWeb3React()
  const [proposalList, setProposalList] = useState([]);

  useEffect(() => {
    if (!!library) {
      const contract = new Contract(HappyDAOABI.address, HappyDAOABI.abi, library.getSigner())
      contract.totalProposals().then((value) => {
        const list = [...Array(value.toNumber()).keys()].map((i) => 
          <Proposal key={i} contract={contract} classes={classes} index={i} />
        )
        setProposalList(list);
      })
    }
  }, [library]);

  return(
    <>
      {proposalList}
    </>
  );
}
export default Proposals;
