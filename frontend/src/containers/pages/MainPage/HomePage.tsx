import { Typography } from "@material-ui/core";

import { PageLayout } from "../../../shared/components/Layout/PageLayout";

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <PageLayout>
        <Typography variant="h3">Home</Typography>
        <Typography variant="body1">Home page content.</Typography>
      </PageLayout>
    </>
  );
  //#endregion
};

export default HomePage;
