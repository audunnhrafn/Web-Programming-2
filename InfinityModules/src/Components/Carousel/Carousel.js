import React from "react";
import "./carousel.css";
import PropTypes from "prop-types";

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      imgCount: 0,
      displyImageNumber: 0
    };
  }

  componentDidMount() {
    this.setState({
      images: this.props.images,
      imgCount: this.props.images.length - 1, // -1 to start on index number 0
      size: this.props.size
    });
  }

  componentWillUnmount() {
    this.clearIntervals();
  }

  nextImg() {
    if (this.state.displyImageNumber !== this.state.imgCount)
      this.setState({
        displyImageNumber: this.state.displyImageNumber + 1
      });
    else {
      this.setState({
        displyImageNumber: 0
      });
    }
  }

  prevImg() {
    if (this.state.displyImageNumber === 0)
      this.setState({
        displyImageNumber: this.state.imgCount
      });
    else {
      this.setState({
        displyImageNumber: this.state.displyImageNumber - 1
      });
    }
  }

  render() {
    return (
      <div className={`container carousel-${this.props.size}`}>
        <button className={`next`} onClick={() => this.nextImg()}>
          ❮
        </button>
        <img
          className={`image`}
          src={this.state.images[this.state.displyImageNumber]}
          alt="images"
        />

        <button className={`prev`} onClick={() => this.prevImg()}>
          ❯
        </button>
      </div>
    );
  }
}

Carousel.propTypes = {
  images: PropTypes.array.isRequired, // Has to have some images
  size: PropTypes.oneOf(["small", "medium", "large"]) // 3 types of Carousels
};

Carousel.defaultProps = {
  size: "medium" // Medium size is default
};

export default Carousel;
