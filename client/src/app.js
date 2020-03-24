import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.scss";

import { BrowserRouter as Router, Route } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import Register from "./components/user/Register";
import Login from "./components/user/Login";
import Dashboard from "./components/Dashboard/Dashboard";
import Confirm from "./components/user/Confirm";
import ForgotPassword from "./components/user/ForgotPassword";
import ResetPassword from "./components/user/ResetPassword";

//Check for token
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  //If token is expired
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <div className="App">
            <Route exact path="/" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/confirmation/:token" component={Confirm} />
            <Route exact path="/forgot-pass" component={ForgotPassword} />
            <Route exact path="/reset-pass/:token" component={ResetPassword} />
          </div>
        </Router>
      </div>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
