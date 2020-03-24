import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { confirmUser } from "../../actions/registerAction";
import { Link } from "react-router-dom";
import isEmpty from "../../utils/isEmpty";

class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      success: false,
      errors: {}
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    this.props.confirmUser({ token: this.props.match.params.token });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.register.confirmation.isConfirmed) {
      this.setState({
        loading: false,
        success: true
      });
    }

    if (!isEmpty(nextProps.errors)) {
      this.setState({
        errors: nextProps.errors,
        loading: false,
        success: false
      });
    }
  }

  render() {
    const { loading, success, errors } = this.state;
    return (
      <main className="confirm-page">
        <div className="confirm-page_cover"></div>
        <div className="confirm-page_content">
          <div className="confirm-page_content-top">
            <img
              src="../img/github.png"
              alt="Github"
              className="confirm-page_content-top_img"
            />
            <h1 className="heading-third confirm-page_content-top_text u-margin-top-small">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/KLagdani/MERN-Auth-BoilerPlate"
                className="confirm-page_content-top_text-a"
              >
                {" "}
                Go to repo
              </a>
            </h1>
          </div>
          <div className="confirm-page_content-bottom">
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
            {success && (
              <div className="confirm-page_content-bottom_text-btn u-margin-top-medium u-center-text">
                <p className="paragraph u-center-text paragraph-success">
                  Your email has been verified !
                </p>
                <Link to="/login" className="confirm-page_content_btn__link">
                  Log in
                </Link>
              </div>
            )}

            {!loading && !success && errors.errors.confirmation && (
              <div className="confirm-page_content-bottom_text-btn u-margin-top-medium u-center-text">
                <p className="paragraph u-center-text paragraph-danger">
                  {errors.errors.confirmation}
                </p>
                <Link to="/login" className="confirm-page_content_btn__link">
                  Go Home
                </Link>
              </div>
            )}
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

Confirm.propTypes = {
  confirmUser: PropTypes.func.isRequired,
  register: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  register: state.register,
  auth: state.register,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { confirmUser }
)(Confirm);
