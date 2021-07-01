import { Redirect, Route, Switch } from "react-router-dom";

import AppLayout from "../../shared/components/Layout/AppLayout";
import LoadingLayout from "../../shared/components/Layout/LoadingLayout";
import { useAccessTokenContext } from "../../shared/contexts/AccessTokenContext";
import { useThemeContext } from "../../shared/contexts/ThemeContext";
import LandingPage from "../pages/LandingPage/LandingPage";
import TaskPage from "../pages/MainPage/TaskPage";
import { SettingsPage } from "../pages/SettingsPage/SettingsPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  const themeContextLoading = useThemeContext();
  //#endregion

  //#region Routes ------------------------------------------------------------
  let routes;

  if (auth.authenticated) {
    routes = (
      <Switch>
        <Route path="/settings" component={SettingsPage} exact />
        <Route path="/:taskList" component={TaskPage} exact />
        <Route path="/" component={TaskPage} exact />
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/signin" component={SignInPage} exact />
        <Route path="/signup" component={SignUpPage} exact />
        <Route path="/" component={LandingPage} exact />
        <Redirect to="/" />
      </Switch>
    );
  }
  //#endregion

  //#region TSX ---------------------------------------------------------------
  if (auth.loading || themeContextLoading) {
    return (
      <>
        <LoadingLayout />
      </>
    );
  }
  return (
    <>
      <AppLayout>{routes}</AppLayout>
    </>
  );
  //#endregion
};

export default App;
