import React from "react";
import RoomListViewItem from "../RoomListViewItem/RoomListViewItem";
import SocketContext from "../../contexts/SocketContext";
import CreateRoom from "../CreateRoom/CreateRoom";
import Room from "../Room/Room";
import toastr from "toastr";
import PropTypes from "prop-types";

class RoomListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomNames: [],
      roomObjects: [],
      roomJoined: "",
      roomObject: {},
      connectedUsers: [],
      activeUsersInRoom: {},
      active: "lobby" // so the default room is lobby
    };
  }

  componentDidMount() {
    const { socket } = this.context;

    socket.on("roomlist", roomlist => {
      var keys = Object.getOwnPropertyNames(roomlist);
      this.setState({
        roomNames: keys,
        roomObjects: roomlist
      });
    });
    socket.emit("rooms");
    socket.emit("users");
    socket.on("userlist", userslist => {
      this.setState({
        connectedUsers: userslist
      });
    });

    if (!this.state.roomJoined) {
      this.joinRoom("lobby");
    }
  }
  // join new room
  joinRoom(roomName) {
    const { socket } = this.context;
    const oldroom = this.state.roomJoined;

    const joinObj = {
      room: roomName
    };

    socket.emit("joinroom", joinObj, response => {
      if (response) {
        if (oldroom && oldroom !== joinObj.room) {
          this.leaveRoom(oldroom);
        }
        this.setState({
          roomJoined: ""
        });
        this.setState({
          roomJoined: roomName,
          roomObject: this.state.roomObjects[roomName],
          active: roomName
        });
      } else {
        toastr.error("You have been banned from entering this room", "Banned!");
      }
    });
  }
  // user leaves room
  leaveRoom(roomName) {
    const { socket } = this.context;
    socket.emit("partroom", roomName);
  }

  render() {
    return (
      <div>
        {this.state.roomJoined ? (
          <Room
            user={this.props.username}
            roomObject={this.state.roomObject}
            room={this.state.roomJoined}
            joinRoom={this.joinRoom.bind(this)}
          />
        ) : null}
        <div className="sidenav ">
          <div className="list-group">
            <h1 className="text-center">Available Rooms</h1>
            {this.state.roomNames.map(item => (
              <div
                key={item}
                className={this.state.active === item ? "activeRoom" : null}
              >
                <RoomListViewItem
                  key={item}
                  room={item}
                  joinRoom={() => this.joinRoom(item)}
                />
              </div>
            ))}
            <CreateRoom />
          </div>
        </div>
      </div>
    );
  }
}

RoomListView.contextType = SocketContext;

RoomListView.propTypes = {
  // get the username
  username: PropTypes.string
};

export default RoomListView;
