import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";
import { Link } from "react-router-dom";

class Dashboard extends React.Component {
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/");
    }
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    return (
      <main className="dashboard-page">
        <div className="dashboard-page_cover"></div>
        <div className="dashboard-page_content">
          <div className="dashboard-page_content-top">
            <img
              src="img/github.png"
              alt="Dashboard"
              className="dashboard-page_content-top_img"
            />
            <h1 className="heading-third dashboard-page_content-top_text u-margin-top-small">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://github.com/KLagdani/MERN-Auth-BoilerPlate"
                className="dashboard-page_content-top_text-a"
              >
                {" "}
                Go to repo
              </a>
            </h1>
          </div>
          <div className="dashboard-page_content-bottom">
            <h1 className="heading-third dashboard-page_content-bottom_text u-margin-top-medium">
              You are logged in as {this.props.auth.user.username}
            </h1>
            <div className="dashboard-page_content-bottom_text-btn u-margin-top-medium">
              <Link
                to="/login"
                className="dashboard-page_content_btn__link"
                onClick={this.onLogoutClick.bind(this)}
              >
                Logout
              </Link>
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

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Dashboard);
