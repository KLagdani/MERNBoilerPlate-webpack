import axios from "axios";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  USER_REGISTERED_FOR_CONFIRMATION,
  USER_CONFIRMED,
  CHECK_USER_CONFIRMATION,
  NEW_CONFRIMATION_MAIL,
  SEND_RESET_LINK,
  CHECK_RESET_TOKEN,
  RESET_PASSWORD
} from "./types";

// Register User
export const registerUser = userData => dispatch => {
  axios
    .post("/api/register/local", userData)
    .then(res => {
      dispatch({
        type: USER_REGISTERED_FOR_CONFIRMATION,
        payload: res.data
      });
      dispatch({
        type: CLEAR_ERRORS
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Check if user is confirmed
export const isConfirmed = userData => dispatch => {
  axios
    .post("/api/register/isconfirmed", userData)
    .then(res => {
      dispatch({
        type: CLEAR_ERRORS
      });
      dispatch({
        type: CHECK_USER_CONFIRMATION,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Send new confirmation link
export const sendConfirmation = userData => dispatch => {
  axios
    .post("/api/register/new-confirmation", userData)
    .then(res => {
      dispatch({
        type: NEW_CONFRIMATION_MAIL,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Confirm User
export const confirmUser = token => dispatch => {
  axios
    .post("/api/register/confirmation", token)
    .then(res => {
      const decoded = jwt_decode(token.token);
      dispatch({
        type: USER_CONFIRMED,
        payload: decoded
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Send reset link for forgotten password
export const sendReset = userData => dispatch => {
  axios
    .post("/api/register/forgot", userData)
    .then(res => {
      dispatch({
        type: CLEAR_ERRORS
      });
      dispatch({
        type: SEND_RESET_LINK,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Check if reset token is valid
export const checkReset = token => dispatch => {
  axios
    .post("/api/register/init-reset", token)
    .then(res => {
      dispatch({
        type: CHECK_RESET_TOKEN,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//Reset password
export const resetPassword = userData => dispatch => {
  axios
    .post("/api/register/reset", userData)
    .then(res => {
      dispatch({
        type: CLEAR_ERRORS
      });
      dispatch({
        type: RESET_PASSWORD
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
