import React from "react";
import RoomListView from "../RoomListView/RoomListView";
import Login from "../Login/Login";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Home extends React.Component {
  render() {
    if (this.props.user.username !== "") {
      return <RoomListView />;
    } else {
      return <Login />;
    }
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user
  };
};

Home.propTypes = {
  // We need to get username
  user: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Home);
