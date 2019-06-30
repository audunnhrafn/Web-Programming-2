import React, { Component } from "react";
import "./App.css";
import {
  Modal,
  Carousel,
  Row,
  Col,
  CartoonNetworkSpinner,
  DatePicker
} from "./Components";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      date: new Date()
    };
  }
  render() {
    return (
      <div className="App">
        <>
          {console.log("Date inside app: " + this.state.date)}
          <DatePicker
            onDatePick={date => this.setState({ date })}
            locale="en-EN"
          />
          <Modal
            isOpen={this.state.isOpen}
            onClose={() => this.setState({ isOpen: false })}
          >
            <Modal.Title>My Modal Title</Modal.Title>
            <Modal.Body>My Modal body</Modal.Body>
            <Modal.Footer>My Modal footer</Modal.Footer>
          </Modal>
          <button
            className="btn btn-primary"
            onClick={() => this.setState({ isOpen: true })}
          >
            {" "}
            MODAL OPEN
          </button>
          <Carousel
            images={[
              "https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg",
              "https://www.w3schools.com/howto/img_forest.jpg",
              "https://www.w3schools.com/howto/img_snow_wide.jpg"
            ]}
            size="small"
          />
          <Carousel
            images={[
              "https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg",
              "https://www.w3schools.com/howto/img_forest.jpg",
              "https://www.w3schools.com/howto/img_snow_wide.jpg"
            ]}
            size="medium"
          />
          <Carousel
            images={[
              "https://cdn.pixabay.com/photo/2016/06/18/17/42/image-1465348_960_720.jpg",
              "https://www.w3schools.com/howto/img_forest.jpg",
              "https://www.w3schools.com/howto/img_snow_wide.jpg"
            ]}
            size="large"
          />
          <Row>
            <Col size={12} />
            <Col size={4} />
            <Col size={4} />
            <Col size={4} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
            <Col size={1} />
          </Row>
          <CartoonNetworkSpinner interval={4} />
        </>
      </div>
    );
  }
}

export default App;
