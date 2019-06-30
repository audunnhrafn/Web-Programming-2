import React from "react";
import CreateRoomView from "../CreateRoomView/CreateRoomView";
import toastr from "toastr";
import SocketContext from "../../contexts/SocketContext";

class CreateRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        roomName: "",
        topic: ""
      }
    };
  }

  onInput(e) {
    this.setState({
      fields: {
        ...this.state.fields,
        [e.target.name]: e.target.value
      }
    });
  }

  submitForm(e) {
    e.preventDefault();
    const { socket } = this.context;
    const newRoom = {
      room: this.state.fields.roomName,
      topic: this.state.fields.topic
    };
    socket.emit("createroom", newRoom, response => {
      if (response) {
        toastr.success("Room was created successfully!", "Hooray!");
      } else {
        toastr.error(
          "Room was not created because it might already exist or the name was invalid",
          "crap!"
        );
      }
    });
  }

  render() {
    return (
      <CreateRoomView
        onInput={e => this.onInput(e)}
        validate={e => this.submitForm(e)}
      />
    );
  }
}

CreateRoom.contextType = SocketContext;

export default CreateRoom;
