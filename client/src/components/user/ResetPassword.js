import React from "react";
import { Link } from "react-router-dom";
import TextField from "../common/TextField";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { checkReset, resetPassword } from "../../actions/registerAction";
import { Alert } from "reactstrap";
import isEmpty from "../../utils/isEmpty";

class ResetPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      email: "",
      password2: "",
      password: "",
      errors: {},
      formLoading: false,
      info: {
        infoVisible: false,
        infoMessage: ""
      },
      resetSuccess: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeInfo = this.closeInfo.bind(this);
    this.openInfo = this.openInfo.bind(this);
  }

  closeInfo() {
    this.setState({
      info: {
        infoVisible: false,
        infoMessage: ""
      }
    });
  }

  openInfo(message) {
    this.setState({
      info: {
        infoVisible: true,
        infoMessage: message
      }
    });
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    this.props.checkReset({ token: this.props.match.params.token });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.register.reset.isResetTokenValid) {
      this.setState({
        loading: false,
        success: true,
        email: nextProps.register.reset.email
      });
    }

    if (nextProps.register.reset.resetSuccess) {
      this.setState({
        resetSuccess: true
      });
    }

    if (!isEmpty(nextProps.errors)) {
      this.setState({
        errors: nextProps.errors
      });
      if (nextProps.errors.errors.token) {
        this.setState({
          loading: false,
          success: false
        });
      }
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.closeInfo();
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({
      formLoading: true
    });

    const userData = {
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      token: this.props.match.params.token
    };

    this.props.resetPassword(userData);
  }
  render() {
    const { loading, success, resetSuccess, errors } = this.state;
    return (
      <main className="login-page">
        <div className="login-page_cover"></div>
        <div className="login-page_content">
          <div className="row login-page_content-row">
            <div className="col-1-of-2 login-page_content-left">
              <div className="login-page_content-left_form">
                <h1 className="heading-first heading-first--main login-page_content-left_form_title u-margin-bottom-medium">
                  {" "}
                  MERN Boiler Plate
                </h1>
                <h1 className="heading-first heading-first--sub u-margin-bottom-big">
                  Welcome to boiler plate
                </h1>

                <Alert
                  color="success"
                  isOpen={this.state.info.infoVisible}
                  toggle={this.closeInfo}
                  className="u-margin-bottom-small"
                >
                  {this.state.info.infoMessage}
                </Alert>

                {loading && (
                  <div className="confirm-page_content-bottom_loader u-margin-top-medium">
                    {" "}
                    <div className="lds-ellipsis">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                )}

                {!loading && !success && errors.errors.token && !resetSuccess && (
                  <div className="confirm-page_content-bottom_text-btn u-margin-top-medium u-center-text">
                    <p className="paragraph u-center-text paragraph-danger">
                      {errors.errors.token}
                    </p>
                    <Link
                      to="/login"
                      className="confirm-page_content_btn__link"
                    >
                      Go Home
                    </Link>
                  </div>
                )}

                {!loading && resetSuccess && (
                  <div className="confirm-page_content-bottom_text-btn u-margin-top-medium u-center-text">
                    <p className="paragraph u-center-text paragraph-success">
                      Your password was successfully reset
                    </p>
                    <Link
                      to="/login"
                      className="confirm-page_content_btn__link"
                    >
                      Go Home
                    </Link>
                  </div>
                )}

                {success && !resetSuccess && (
                  <form
                    className="login-page_content-left_form-content form"
                    onSubmit={this.onSubmit}
                  >
                    <div className="form-group">
                      <TextField
                        placeholder="Email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        error={errors.errors && errors.errors.email}
                        iconning="fas fa-envelope floaty-icon"
                        disabled={"disabled"}
                        readOnly={"readOnly"}
                      />

                      <TextField
                        placeholder="Password"
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.onChange}
                        error={errors.errors && errors.errors.password}
                        iconning="fas fa-lock floaty-icon"
                      />

                      <TextField
                        placeholder="Confirm Password"
                        name="password2"
                        type="password"
                        value={this.state.password2}
                        onChange={this.onChange}
                        error={errors.errors && errors.errors.password2}
                        iconning="fas fa-lock floaty-icon"
                      />
                    </div>
                    {!this.state.formLoading && (
                      <button
                        type="submit"
                        className="form__btn u-margin-top-medium"
                      >
                        <i class="fas fa-lock"></i> &nbsp; Reset
                      </button>
                    )}

                    {this.state.formLoading && (
                      <div className="form__spinner u-margin-top-medium">
                        <div className="lds-ellipsis">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
            <div className="col-1-of-2 login-page_content-right">
              <img
                src="../img/login.png"
                alt="login"
                className="login-page_content-right_img u-margin-bottom-medium"
              />
              <div className="u-center-text login-page_content-right_text">
                <h2 className="heading-third login-page_content-right_text-title u-margin-bottom-small">
                  Reset your password
                </h2>
                <p className="paragraph u-center-text login-page_content-right_text-p">
                  Please enter your new password
                </p>
                <div className="login-page_content-right_text-btn u-margin-top-small">
                  <Link to="/login" className="btn__link btn__link-white">
                    Or Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__copyright">
          <a
            target="_blank"
            href="http://lagdani.com"
            className="footer__link"
            rel="noopener noreferrer"
          >
            © Kaoutar Lagdani
          </a>
        </div>
      </main>
    );
  }
}

ResetPassword.propTypes = {
  checkReset: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  register: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  register: state.register,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { checkReset, resetPassword }
)(ResetPassword);
