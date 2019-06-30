import React from "react";
import PropTypes from "prop-types";

const RoomListViewItem = props => {
  const name = props.room;
  const joinRoom = props.joinRoom;
  return (
    <a onClick={joinRoom} className="listroom">
      {name}
    </a>
  );
};

RoomListViewItem.propTypes = {
  // get the room name
  name: PropTypes.string,
  // get the join function
  joinRoom: PropTypes.func
};
export default RoomListViewItem;
