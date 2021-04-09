import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";

// core components
import componentStyles from "../../assets/theme/components/auth-header.js";

const useStyles = makeStyles(componentStyles);

const AuthHeader = () => {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Box
        className={classes.header}
        position="relative"
        paddingTop="8rem"
        paddingBottom="8rem"
      >
        <Container maxWidth="xl">
          <Box marginBottom="6rem" textAlign="center">
            <Box
              component={Grid}
              container
              justifyContent="center"
              color={theme.palette.white.main}
            >
              <Grid item lg={5} md={6} xs={12}>
                <h1>HappyDAO :)</h1>
                <Box
                  component="h3"
                  color={theme.palette.gray[400]}
                  lineHeight="1.7"
                  fontSize="1rem"
                >
                  The World's simplest Decentralized Autonomous Organization for citizens of the metaverse 
                </Box>
                <Box marginBottom="6rem" marginLeft="4rem" textAlign="left">
                <Box
                  component="li"
                  color={theme.palette.gray[400]}
                  lineHeight="1.7"
                  fontSize="1rem"
                >
                  Create an organization on the blockchain
                </Box>
                <Box
                  component="li"
                  color={theme.palette.gray[400]}
                  lineHeight="1.7"
                  fontSize="1rem"
                >
                  Anyone can join the organization
                </Box>
                <Box
                  component="li"
                  color={theme.palette.gray[400]}
                  lineHeight="1.7"
                  fontSize="1rem"
                >
                  Anyone can submit proposals
                </Box>
                <Box
                  component="li"
                  color={theme.palette.gray[400]}
                  lineHeight="1.7"
                  fontSize="1rem"
                >
                  Members can vote on proposals
                </Box>
                <Box
                  component="li"
                  color={theme.palette.gray[400]}
                  lineHeight="1.7"
                  fontSize="1rem"
                >
                  Manage treasury
                </Box>
                </Box>

              </Grid>
            </Box>
          </Box>
        </Container>
        <Box
          position="absolute"
          zIndex="100"
          height="70px"
          top="auto"
          bottom="0"
          pointerEvents="none"
          left="0"
          right="0"
          width="100%"
          overflow="hidden"
          transform="translateZ(0)"
        >
          <Box
            bottom="0"
            position="absolute"
            pointerEvents="none"
            component="svg"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            version="1.1"
            viewBox="0 0 2560 100"
            x="0"
            y="0"
          >
            <Box
              component="polygon"
              fill={theme.palette.dark.main}
              points="2560 0 2560 100 0 100"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AuthHeader;
