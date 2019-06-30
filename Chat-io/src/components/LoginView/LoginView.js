import React from "react";
import PropTypes from "prop-types";

const LoginView = props => {
  const getInput = props.onInput;
  const getUser = props.getUser;
  const error = props.error;
  return (
    <div className="centered-container">
      <h1 className="title">Welcome to Chat.io</h1>
      <form onSubmit={getUser}>
        <div className="input-group">
          <input
            type="text"
            autoFocus
            className={error ? "form-control is-invalid" : "form-control"}
            placeholder={error ? "Username is taken/invalid" : "Username.."}
            onInput={getInput}
          />
          <input
            type="submit"
            value="Start chatting!"
            className="input-group btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
};

LoginView.propTypes = {
  // validatate function to validate if it is correct
  getUser: PropTypes.func,
  // get the input and put it in the parent state
  getInput: PropTypes.func
};
export default LoginView;
