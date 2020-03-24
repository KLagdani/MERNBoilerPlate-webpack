import {
  USER_REGISTERED_FOR_CONFIRMATION,
  USER_CONFIRMED,
  CHECK_USER_CONFIRMATION,
  NEW_CONFRIMATION_MAIL,
  SEND_RESET_LINK,
  CHECK_RESET_TOKEN,
  RESET_PASSWORD
} from "../actions/types";

const initialState = {
  user: {},
  confirmation: {
    emailSent: false,
    newEmailSent: false,
    isConfirmed: false
  },
  reset: {
    isResetTokenValid: false,
    email: "",
    emailSent: false,
    resetSuccess: false
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_REGISTERED_FOR_CONFIRMATION:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload.user.email
        },
        confirmation: {
          ...state.confirmation,
          emailSent: action.payload.emailSent,
          isConfirmed: false,
          newEmailSent: false
        }
      };
    case USER_CONFIRMED:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          isConfirmed: true
        },
        user: action.payload
      };
    case NEW_CONFRIMATION_MAIL:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          newEmailSent: action.payload.emailSent,
          isConfirmed: action.payload.user.confirmed
        },
        user: {
          ...state.user,
          email: action.payload.user.email
        }
      };
    case CHECK_USER_CONFIRMATION:
      return {
        ...state,
        confirmation: {
          ...state.confirmation,
          isConfirmed: action.payload.isConfirmed
        }
      };
    case SEND_RESET_LINK:
      return {
        ...state,
        reset: {
          ...state.reset,
          emailSent: action.payload.emailSent,
          email: action.payload.user.email
        }
      };
    case CHECK_RESET_TOKEN:
      return {
        ...state,
        reset: {
          ...state.reset,
          isResetTokenValid: action.payload.token,
          email: action.payload.email
        }
      };
    case RESET_PASSWORD:
      return {
        ...state,
        reset: {
          ...state.reset,
          resetSuccess: true
        }
      };
    default:
      return state;
  }
};
