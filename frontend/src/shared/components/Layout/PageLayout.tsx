import { Grid, Paper } from "@material-ui/core";

import usePageLayoutStyles from "./PageLayoutStyles";

interface PageProps {}

export const PageLayout: React.FC<PageProps> = ({ children }) => {
  //#region Styles ------------------------------------------------------------
  const classes = usePageLayoutStyles();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.pageLayout_paper}>{children}</Paper>
        </Grid>
      </Grid>
    </>
  );
  //#endregion
};
