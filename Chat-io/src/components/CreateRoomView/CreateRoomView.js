import React from "react";
import PropTypes from "prop-types";

const CreateRoomView = props => {
  const inputValidation = props.onInput;
  const validateForm = props.validate;
  return (
    <div className="modal-container">
      <div className="create-room">
        <button
          type="button"
          className="btn btn-dark btn-lg"
          data-toggle="modal"
          data-target="#createRoomModal"
        >
          Create Room
        </button>
      </div>

      <div className="modal fade" id="createRoomModal" role="dialog">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="text-center">Create your room!</h4>
            </div>
            <div className="modal-body">
              <form className="form-group">
                <label>Room Name:</label>
                <input
                  onInput={inputValidation}
                  type="text"
                  className="form-control room-input"
                  name="roomName"
                />
                <label>Topic:</label>
                <input
                  onInput={inputValidation}
                  type="text"
                  className="form-control room-input"
                  name="topic"
                />
              </form>
            </div>
            <div className="modal-footer">
              <input
                type="submit"
                value="Create!"
                className="btn btn-success"
                data-dismiss="modal"
                onClick={validateForm}
              />
              <input
                type="button"
                value="cancel"
                className="btn btn-danger"
                data-dismiss="modal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CreateRoomView.propTypes = {
  // onInput function that is used to change on input
  onInput: PropTypes.func.isRequired,
  // validatate function to validate if it is correct
  validate: PropTypes.func.isRequired
};

export default CreateRoomView;
