import React from "react";
import LoginView from "../LoginView/LoginView";
import SocketContext from "../../contexts/SocketContext";
import RoomListView from "../RoomListView/RoomListView";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      usernameSet: false,
      error: false
    };
  }

  getInput(e) {
    this.setState({
      username: e.target.value
    });
  }

  getUser(e) {
    e.preventDefault();
    const { socket } = this.context;

    if (this.state.username === "") {
      this.setState({ error: true });
      return;
    }

    socket.emit("adduser", this.state.username, response => {
      if (response) {
        this.setState({
          usernameSet: true
        });
      } else {
        this.setState({
          error: true
        });
      }
    });
  }

  render() {
    if (this.state.usernameSet) {
      return <RoomListView username={this.state.username} />;
    } else {
      return (
        <>
          <LoginView
            onInput={e => this.getInput(e)}
            getUser={e => this.getUser(e)}
            error={this.state.error}
          />
        </>
      );
    }
  }
}

Login.contextType = SocketContext;

export default Login;
