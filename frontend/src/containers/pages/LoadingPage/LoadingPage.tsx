import { Container, Typography } from "@material-ui/core";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";

import useLoadingPageStyles from "./LoadingPageStyles";

interface LoadingPageProps {}

const LoadingPage: React.FC<LoadingPageProps> = () => {
  //#region Styles ------------------------------------------------------------
  const classes = useLoadingPageStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Container className={classes.loadingPage_container} maxWidth="sm">
        <Typography
          className={classes.loadingPage_loadingText}
          align="center"
          variant="h3"
        >
          <AssignmentTurnedInIcon fontSize="inherit" />
          <br />
          Loading...
        </Typography>
      </Container>
    </>
  );
  //#endregion
};

export default LoadingPage;
