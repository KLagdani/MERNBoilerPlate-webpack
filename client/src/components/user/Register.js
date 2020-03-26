import React from "react";
import { Link } from "react-router-dom";
import TextField from "../common/TextField";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { registerUser } from "../../actions/registerAction";
import { Alert } from "reactstrap";
import isEmpty from "../../utils/isEmpty";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      alert: {
        alertVisible: false,
        alertMessage: ""
      },
      loading: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.openAlert = this.openAlert.bind(this);
  }

  closeAlert() {
    this.setState({
      alert: {
        alertVisible: false,
        alertMessage: ""
      }
    });
  }

  openAlert(message) {
    this.setState({
      alert: {
        alertVisible: true,
        alertMessage: message
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

    if (nextProps.register.confirmation.emailSent) {
      this.openAlert(
        `Please confirm your email at: ${this.props.register.user.email}`
      );
      this.setState({
        email: "",
        username: "",
        password: "",
        password2: "",
        loading: false
      });
    }

    if (!isEmpty(nextProps.errors)) {
      this.setState({ errors: nextProps.errors, loading: false });
      this.closeAlert();
    }

    if (isEmpty(nextProps.errors)) {
      this.setState({ errors: "" });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({
      loading: true
    });

    const userData = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(userData);
  }
  render() {
    const { errors } = this.state;
    return (
      <main className="register-page">
        <div className="register-page_cover"></div>
        <div className="register-page_content">
          <div className="row register-page_content-row">
            <div className="col-1-of-2 register-page_content-left">
              <img
                src="img/register.png"
                alt="Register"
                className="register-page_content-left_img"
              />
              <div className="u-center-text register-page_content-left_text">
                <h2 className="heading-third register-page_content-left_text-title u-margin-bottom-small">
                  Register Here
                </h2>
                <p className="paragraph u-center-text register-page_content-left_text-p">
                  Hello, glad you're here :)
                </p>
                <div className="register-page_content-left_text-btn u-margin-top-small">
                  <Link to="/login" className="btn__link btn__link-white">
                    Already got an account ?
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-1-of-2 register-page_content-right">
              <div className="register-page_content-right_form">
                <h1 className="heading-first heading-first--main register-page_content-right_form_title u-margin-bottom-medium">
                  {" "}
                  MERN Boiler Plate
                </h1>
                <h1 className="heading-first heading-first--sub">
                  Welcome to boiler plate
                </h1>
                <Alert
                  color="success"
                  isOpen={this.state.alert.alertVisible}
                  toggle={this.closeAlert}
                  className="u-margin-bottom-small"
                >
                  {this.state.alert.alertMessage}
                </Alert>

                <form
                  className="register-page_content-right_form-content form"
                  onSubmit={this.onSubmit}
                >
                  <div className="form-group">
                    <TextField
                      placeholder="Username"
                      name="username"
                      type="text"
                      value={this.state.username}
                      onChange={this.onChange}
                      error={errors.errors && errors.errors.username}
                      iconning="fas fa-user"
                    />
                    <TextField
                      placeholder="Email"
                      name="email"
                      type="text"
                      value={this.state.email}
                      onChange={this.onChange}
                      error={errors.errors && errors.errors.email}
                      iconning="fas fa-envelope floaty-icon"
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
                  {!this.state.loading && (
                    <button
                      type="submit"
                      className="form__btn u-margin-top-medium"
                    >
                      <i className="fas fa-user-plus"></i> &nbsp; Register
                    </button>
                  )}

                  <div className="form__spinner u-margin-top-medium">
                    {this.state.loading && (
                      <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    )}
                  </div>
                </form>
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
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
  { registerUser }
)(Register);
