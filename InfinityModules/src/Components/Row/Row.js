import React from "react";
import PropTypes from "prop-types";
import "./row.css";

const Row = ({ children }) => {
  return <div className={`row`}> {children}</div>;
};

Row.propTypes = {
  children: PropTypes.node.isRequired // It must have atleast one <Col>
};

export default Row;
