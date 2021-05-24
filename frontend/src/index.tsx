import "./index.css";

import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./containers/app/App";
import reportWebVitals from "./reportWebVitals";
import { ErrorBoundary } from "./shared/components/ErrorBoundary/ErrorBoundary";

ReactDOM.render(
  <ErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ErrorBoundary>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
