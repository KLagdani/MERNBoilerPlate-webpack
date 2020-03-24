import axios from "axios";

const setAuthToken = token => {
  if (token) {
    // Apply to every request
    const TokenArray = token.split(" ");
    axios.defaults.headers.common["x-auth-token"] = TokenArray[1];
  } else {
    // Delete auth header
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
