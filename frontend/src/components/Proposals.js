import React, {useEffect, useState} from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { makeStyles } from "@material-ui/core/styles";
import {useWeb3React} from "@web3-react/core";
import componentStyles from "../assets/theme/views/admin/dashboard.js";
import {Contract} from "@ethersproject/contracts";
import HappyDAOABI from "../../contracts/localhost/HappyDao.json";
import {  shorter } from '../utils'
import {formatEther} from "@ethersproject/units";
import Modal from '@material-ui/core/Modal';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { ContractAddress } from '../utils';

const useStyles = makeStyles(componentStyles);

const options = ['Vote Yes', 'Vote No', 'Release Funds'];

const ProposalActions = (props) => {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClick = (index) => {
    if(options[selectedIndex] == "Vote Yes") {
      props.contract.voteForProposal(props.index, 1).then(() => {
        console.log("Voted yes for proposal " + props.index);
      });
    } else if (options[selectedIndex] == "Vote No") {
      props.contract.voteForProposal(props.index, 2).then(() => {
        console.log("Voted no for proposal " + props.index);
      });
    } else {
      props.contract.releaseFund(props.index).then(() => {
        console.log("Released funds for proposal " + props.index);
      });
    }
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <ButtonGroup variant="contained" color="primary" ref={anchorRef} aria-label="split button">
          <Button onClick={() => handleClick(props.index)}>{options[selectedIndex]}</Button>
          <Button
            color="primary"
            size="small"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select merge strategy"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">
                    {options.map((option, index) => (
                      <MenuItem
                        key={option}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index)}
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}

const Proposal = (props) => {
  
  const [proposal, setProposal] = useState({});
  const classes = props.classes;
  useEffect(() => {
    props.contract.getProposal(props.index).then((proposal) => {
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
        {(proposal.amount ? parseFloat(formatEther(proposal.amount)).toPrecision(4) : 0)} ETH
      </TableCell>
      <TableCell classes={{ root: classes.tableCellRoot }}>
        {proposal.yesVotes ? proposal.yesVotes.toString() : 0}
      </TableCell>
      <TableCell classes={{ root: classes.tableCellRoot }}>
        {proposal.noVotes ? proposal.noVotes.toString() : 0}
      </TableCell>
      <TableCell classes={{ root: classes.tableCellRoot }}>
        <ProposalActions index={props.index} contract={props.contract} />
      </TableCell>
    </TableRow>
  );
}

const Proposals = () => {
  const classes = useStyles();
  const {account, library, chainId} = useWeb3React()
  const [proposalList, setProposalList] = useState([]);
  useEffect(() => {
    if (!!library) {
      const contractAddresses = ContractAddress(chainId);
      const contract = new Contract(contractAddresses.HappyDao, HappyDAOABI.abi, library.getSigner())
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
