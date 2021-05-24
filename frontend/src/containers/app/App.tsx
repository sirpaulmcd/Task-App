import { AppLayout } from "../../shared/components/Layout/AppLayout";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  //#region TSX
  return (
    <>
      <AppLayout>hello</AppLayout>
    </>
  );
  //#endregion
};

export default App;
