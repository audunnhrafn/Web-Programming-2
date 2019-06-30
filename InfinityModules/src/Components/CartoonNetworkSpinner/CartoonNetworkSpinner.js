import React from "react";
import PropTypes from "prop-types";
import "./cartoonnetworkspinner.css";

class CartoonNetworkSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chars: [
        "https://i.pinimg.com/236x/68/12/ff/6812ffd07edabd8a2018b650041da99d--classic-cartoons-character-inspiration.jpg",
        "http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i24/dex_dexter_174x252.png",
        "http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i24/dex_mandark_174x252.png",
        "http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i24/dex_mom_174x252.png",
        "http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i24/dex_deedee_174x252.png",
        "http://i.cdn.turner.com/v5cache/CARTOON/site/Images/i24/dex_dad_174x252.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Agu6AItVSkscsYlVxxnSK-nWib60RiJ4aYAh1y9dSMTfQrr6",
        "https://www.cartoonnetworkamazone.com/wp-content/themes/cna/assets/img/experience/shows/cn-friends/dexters-lab/main-char.png",
        "https://banner2.kisspng.com/20180403/vpw/kisspng-gumball-watterson-richard-watterson-cartoon-networ-amazing-5ac3d9dcdfac78.4861128615227847329162.jpg",
        "https://i.pinimg.com/originals/32/5c/a9/325ca9f563bd5b122c57c37532f17efd.jpg",
        "https://images-na.ssl-images-amazon.com/images/I/41ryyf6-ExL.jpg"
      ],
      spin: false,
      showImg: 0,
      imgChange: false
    };
  }

  componentDidMount() {
    setInterval(this.getRandomImg.bind(this), this.props.interval * 1000);
  }

  getRandomImg() {
    const min = 0;
    const max = 11; // Number of pictures
    let rand = Math.floor(Math.random() * (max - 0)) + min; // Random function
    this.setState({
      showImg: rand
    });
  }

  render() {
    return (
      <div className={`imageSize`}>
        <img
          src={this.state.chars[this.state.showImg]}
          alt="CartoonImage"
          className={`imageSpin`}
          style={{ WebkitAnimationDuration: this.props.interval + "s" }}
        />
      </div>
    );
  }
}

CartoonNetworkSpinner.propTypes = {
  interval: PropTypes.number // Interval number
};

CartoonNetworkSpinner.defaultProps = {
  interval: 3 // Default interval 3 seconds
};

export default CartoonNetworkSpinner;
