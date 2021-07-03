import { Link as RouterLink } from "react-router-dom";

import { Box, Button, Fade, Link, Typography } from "@material-ui/core";

import landingPageImage from "../../../assets/landingPageImage.png";
import useLandingPageStyles from "./LandingPageStyles";

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useLandingPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Fade in={true}>
        <div className={classes.landingPage_container}>
          <Typography variant="h3" align="center">
            Welcome to Task App
          </Typography>
          <Typography
            className={classes.landingPage_caption}
            variant="h5"
            align="center"
          >
            Manage your TODO style tasks on desktop or mobile
          </Typography>
          <img
            className={classes.landingPage_image}
            src={landingPageImage}
            alt="todo tasks preview"
          />
          <Button
            className={classes.landingPage_signUpButton}
            component={RouterLink}
            to={"/signup"}
            size="large"
            variant="contained"
            color="primary"
          >
            Sign Up Today
          </Button>
          <div className={classes.landingPage_disclaimerContainer}>
            <Typography variant="subtitle1">
              <Box fontWeight="bold" display="inline">
                Disclaimer:{" "}
              </Box>
              This is not a real production app. It is a deployed{" "}
              <Link href="https://sirpaulmcd.com/projects/task-app/">
                portfolio
              </Link>{" "}
              project. Any input information is periodically cleared from the
              database. This project is open source. Feel free to examine the{" "}
              <Link href="https://github.com/sirpaulmcd/Task-App">repo</Link>.
            </Typography>
          </div>
        </div>
      </Fade>
    </>
  );
  //#endregion
};

export default LandingPage;
