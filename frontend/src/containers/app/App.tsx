import { Redirect, Route, Switch } from "react-router-dom";

import { AppLayout } from "../../shared/components/Layout/AppLayout";
import LandingPage from "../pages/MainPage/LandingPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  //#region Routes
  let routes;
  routes = (
    <Switch>
      <Route path="/signin" component={SignInPage} exact />
      <Route path="/signup" component={SignUpPage} exact />
      <Route path="/" component={LandingPage} exact />
      <Redirect to="/" />
    </Switch>
  );
  //#endregion

  //#region TSX
  return (
    <>
      <AppLayout>{routes}</AppLayout>
    </>
  );
  //#endregion
};

export default App;
