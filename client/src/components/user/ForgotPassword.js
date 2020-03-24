import React from "react";
import { Link } from "react-router-dom";
import TextField from "../common/TextField";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { loginUser } from "../../actions/authActions";
import { sendReset } from "../../actions/registerAction";
import { Alert } from "reactstrap";
import isEmpty from "../../utils/isEmpty";

class ForgotPassword extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {},
      info: {
        infoVisible: false,
        infoMessage: ""
      },
      loading: false
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
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.register.reset.emailSent) {
      this.setState({ loading: false });
      this.openInfo(`Reset email sent to: ${nextProps.register.reset.email}`);
    }

    if (!isEmpty(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, loading: false });
    }

    if (isEmpty(nextProps.errors)) {
      this.setState({ errors: "" });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    this.closeInfo();
    this.setState({ errors: "" });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.sendReset({ email: this.state.email });
  }
  render() {
    const { errors } = this.state;
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

                <form
                  className="login-page_content-left_form-content form"
                  onSubmit={this.onSubmit}
                >
                  <div className="form-group">
                    <TextField
                      placeholder="Email"
                      name="email"
                      type="text"
                      value={this.state.email}
                      onChange={this.onChange}
                      error={errors.errors && errors.errors.email}
                      iconning="fas fa-envelope floaty-icon"
                    />
                  </div>
                  {!this.state.loading && (
                    <button
                      type="submit"
                      className="form__btn u-margin-top-medium"
                    >
                      <i class="far fa-paper-plane"></i> &nbsp; Send reset link
                    </button>
                  )}

                  {this.state.loading && (
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
              </div>
            </div>
            <div className="col-1-of-2 login-page_content-right">
              <img
                src="img/forgot.png"
                alt="login"
                className="login-page_content-right_img u-margin-bottom-medium"
              />
              <div className="u-center-text login-page_content-right_text">
                <h2 className="heading-third login-page_content-right_text-title u-margin-bottom-small">
                  Forgot your password ?
                </h2>
                <p className="paragraph u-center-text login-page_content-right_text-p">
                  We'll send you instructions to reset yout password.
                </p>
                <div className="login-page_content-right_text-btn u-margin-top-small">
                  <Link to="/" className="btn__link btn__link-white">
                    Login
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

ForgotPassword.propTypes = {
  loginUser: PropTypes.func.isRequired,
  sendReset: PropTypes.func.isRequired,
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
  { loginUser, sendReset }
)(ForgotPassword);
