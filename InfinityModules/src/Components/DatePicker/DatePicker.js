import React from "react";
import propTypes from "prop-types";
import "./DatePicker.css";

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      locale: ""
    };
  }
  componentDidMount() {
    this.setState({
      locale: this.props.locale
    });
  }
  handleChange(e) {
    var date = e.target.valueAsDate;
    var locale = this.state.locale;
    console.log("date inside datepicker: " + date);
    this.props.onDatePick(date.toLocaleDateString(locale));
  }
  render() {
    return (
      <div className={"field"}>
        <label>Date:</label>
        <input type="date" onChange={e => this.handleChange(e)} />
      </div>
    );
  }
}
DatePicker.propTypes = {
  onDatePick: propTypes.func.isRequired //Requied function onDatePick
};

DatePicker.defaultProps = {
  locale: "is-IS" //Default props is-IS
};

export default DatePicker;
