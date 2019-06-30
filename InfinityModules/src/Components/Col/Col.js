import React from "react";
import PropTypes from "prop-types";

const Col = ({ size }) => {
  return (
    <div className={`col`} style={{ width: (size / 12) * 1200 }}>
      column
    </div>
  );
};

Col.propTypes = {
  size: PropTypes.number
};

Col.defaultProps = {
  size: 1 // Default size of col is 1
};

export default Col;
