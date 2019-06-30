import React from "react";
import propTypes from "prop-types";
import "./modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  if (isOpen) {
    return (
      <div className={`modal`}>
        <div className={`modal-content`}>
          <button className={`close`} onClick={onClose}>
            X
          </button>{" "}
          {children}
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};

Modal.Title = ({ children }) => {
  return <h1>{children}</h1>;
};

Modal.Body = ({ children }) => {
  return <p>{children}</p>;
};

Modal.Footer = ({ children }) => {
  return <footer className={`footer`}>{children}</footer>;
};

Modal.propTypes = {
  isOpen: propTypes.bool.isRequired, // Required bool isOpen
  onClose: propTypes.func.isRequired, // Required function onclose
  children: propTypes.node
};

Modal.defaultProps = {
  isOpen: false // Default false
};

export default Modal;
