import React from "react";
import SocketContext from "../../contexts/SocketContext";
import toastr from "toastr";
import PropTypes from "prop-types";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      topic: "",
      messages: [],
      message: "",
      admins: {},
      activeUsers: [],
      user: "",
      recipient: "", //for private messaging
      privateMsg: ""
    };
  }

  //Update messages and if user joins or leaves
  componentDidMount() {
    this.setState({
      name: this.props.room,
      user: this.props.user,
      topic: this.props.roomObject.topic
    });

    this.updateUsers();
    const { socket } = this.context;
    // update the chat
    socket.on("updatechat", (roomName, messages) => {
      if (roomName === this.state.name) {
        this.setState({
          messages: messages
        });
      }
    });
    // Private messages
    socket.on("recv_privatemsg", (sender, message, recip) => {
      if (this.state.user === recip) {
        toastr.info(message, "Message from " + sender, { timeOut: 0 });
      }
    });
    //listen to if someone is kicked
    socket.on("kicked", (currentRoom, kickedUser, admin) => {
      const { room, user } = this.props;
      if (currentRoom === room && user === kickedUser) {
        this.props.joinRoom("lobby");
        socket.emit("partroom", room);
      }
    });
    //listen to if someone is banned
    socket.on("banned", (currentRoom, kickedUser, admin) => {
      const { room, user } = this.props;
      if (currentRoom === room && user === kickedUser) {
        this.props.joinRoom("lobby");
        socket.emit("partroom", room);
      }
    });
  }
  // updates the active users and admins
  updateUsers() {
    const { socket } = this.context;
    const currentRoom = this.props.room;
    socket.on("updateusers", (room, users, ops) => {
      if (room === currentRoom) {
        this.setState({
          activeUsers: users,
          admins: ops
        });
      }
    });
  }

  // Kicking user
  kickUser(user) {
    if (this.checkIfAdmin()) {
      const { socket } = this.context;
      const kickObj = {
        user: user,
        room: this.state.name
      };
      socket.emit("kick", kickObj, response => {
        if (response) {
          this.sendMessage("kicked " + kickObj.user + " from " + kickObj.room);
        }
      });
    } else {
      toastr.error("You need to be an admin to do that", "Invalid operation");
    }
  }
  // seeing if user is admin
  checkIfAdmin() {
    const admins = this.state.admins;
    const currUser = this.state.user;
    if (currUser === admins[currUser]) {
      return true;
    } else {
      return false;
    }
  }
  // banning user
  banUser(user) {
    if (this.checkIfAdmin()) {
      const { socket } = this.context;
      const banObj = {
        user: user,
        room: this.state.name
      };
      socket.emit("ban", banObj, response => {
        if (response) {
          this.sendMessage("banned " + banObj.user + " from " + banObj.room);
        }
      });
    } else {
      toastr.error("You need to be an admin to do that", "Invalid operation");
    }
  }
  // making user admin
  opUser(user) {
    if (this.checkIfAdmin()) {
      const { socket } = this.context;
      const opObj = {
        user: user,
        room: this.state.name
      };
      socket.emit("op", opObj, response => {
        if (response) {
          this.sendMessage(opObj.user + " has been granted admin ");
        }
      });
      this.updateUsers();
    } else {
      toastr.error("You need to be an admin to do that", "Invalid operation");
    }
  }
  // deopping a user
  deOpUser(user) {
    if (this.checkIfAdmin()) {
      const { socket } = this.context;
      const deopObj = {
        user: user,
        room: this.state.name
      };
      socket.emit("deop", deopObj, response => {
        if (response) {
          this.sendMessage(deopObj.user + " is no longer admin");
        }
      });
      this.updateUsers();
    } else {
      toastr.error("You need to be an admin to do that", "Invalid operation");
    }
  }

  //sending message
  sendMessage(message) {
    if (message === "") {
      return false;
    }

    const messageObject = {
      msg: message,
      roomName: this.state.name
    };

    const { socket } = this.context;
    socket.emit("sendmsg", messageObject);
    this.setState({
      message: ""
    });
  }
  // setting recipient of private messages
  setRecipient(recipient) {
    this.setState({ recipient: recipient });
  }
  // sending private message
  sendPrivateMessage() {
    const { socket } = this.context;

    const msgObj = {
      nick: this.state.recipient,
      message: this.state.privateMsg
    };
    socket.emit("privatemsg", msgObj, response => {
      if (response) {
        toastr.success("Message sent to " + msgObj.nick + "!", "Success!");
      }
    });
    this.setState({
      privateMsg: ""
    });
  }

  render() {
    const {
      name,
      topic,
      messages,
      message,
      admins,
      activeUsers,
      user
    } = this.state;

    return (
      <>
        <div className="">
          <div className="text-center">
            <h1>{name}</h1>
            <h4>{topic}</h4>
          </div>
          <div className="chat-window">
            <div className="messages">
              {messages.map(m => (
                <div className="message">
                  <span className="username"> {m.nick} </span>- {m.message}
                </div>
              ))}
            </div>
            <div className="users">
              <span className="font-weight-bold">users</span>
              {Object.keys(activeUsers).map(u => (
                <div key={u}>
                  {admins[u] === u ? null : (
                    <div key={u} className="profile">
                      <li className={u === user ? "user" : ""}> {u} </li>
                      {u === user ? (
                        <></>
                      ) : (
                        <ul className="menu">
                          <div>
                            <li
                              data-toggle="modal"
                              data-target="#sendPrivateMsg"
                              onClick={() => this.setRecipient(u)}
                            >
                              send message
                            </li>
                          </div>
                          <li onClick={() => this.kickUser(u)}>Kick</li>
                          <li onClick={() => this.banUser(u)}>Ban</li>
                          <li onClick={() => this.opUser(u)}>Op User</li>
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="admins">
                <span className="font-weight-bold">admins</span>
                {Object.keys(admins).map(a => (
                  <div key={a} className="profile">
                    <li className={a === user ? "user" : ""}>{a}</li>
                    <ul className="menu">
                      <div>
                        {a === user ? null : (
                          <>
                            <li
                              data-toggle="modal"
                              data-target="#sendPrivateMsg"
                              onClick={() => this.setRecipient(a)}
                            >
                              send message
                            </li>
                            <li onClick={() => this.deOpUser(a)}>deOp User</li>
                          </>
                        )}
                      </div>
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <form
              onSubmit={e => e.preventDefault()}
              className="input-container"
            >
              <input
                type="text"
                value={message}
                onChange={e => this.setState({ message: e.target.value })}
                placeholder="Whats on your mind?"
              />
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => this.sendMessage(message)}
              >
                Send
              </button>
            </form>
          </div>
        </div>
        <div className="modal fade" id="sendPrivateMsg" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="text-center">
                  Send message to {this.state.recipient}
                </h4>
              </div>
              <div className="modal-body">
                <form className="form-group">
                  <input
                    type="text"
                    className="form-control room-input"
                    placeholder="Enter your message here..."
                    onChange={e =>
                      this.setState({ privateMsg: e.target.value })
                    }
                  />
                </form>
              </div>
              <div className="modal-footer">
                <input
                  type="submit"
                  value="Send"
                  onClick={() => this.sendPrivateMessage()}
                  className="btn btn-success"
                  data-dismiss="modal"
                />
                <input
                  type="button"
                  value="Cancel"
                  className="btn btn-danger"
                  data-dismiss="modal"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

Room.contextType = SocketContext;

Room.propTypes = {
  // get the username
  user: PropTypes.string.isRequired,
  // get the room object
  roomObject: PropTypes.object.isRequired,
  // get the room name
  room: PropTypes.string.isRequired,
  // get the join room from roomlistview
  joinRoom: PropTypes.func.isRequired
};

export default Room;
