import { Typography } from "@material-ui/core";

import { PageLayout } from "../../../shared/components/Layout/PageLayout";

interface LandingPageProps {}

const LandingPage: React.FC<LandingPageProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <PageLayout>
        <Typography variant="h3">Task App</Typography>
        <Typography variant="body1">Fancy landing page content.</Typography>
      </PageLayout>
    </>
  );
  //#endregion
};

export default LandingPage;
