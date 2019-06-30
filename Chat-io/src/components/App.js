import React, { Component } from "react";
import Home from "./Home/Home";
import SocketContext from "../contexts/SocketContext";
import Favicon from "react-favicon";
import icon from "../styles/chat.svg";

class App extends Component {
  componentWillUnmount() {
    const { socket } = this.context;
    socket.emit("disconnect");
  }
  render() {
    return (
      <>
        <Favicon url={icon} />
        <Home />
      </>
    );
  }
}

App.contextType = SocketContext;

export default App;
