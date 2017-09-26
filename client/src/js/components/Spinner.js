import React, { PropTypes, Component } from 'react';


class Spinner extends Component {

  render() {
    let color = '#ccc';
    if (this.props.color) {
      color = this.props.color;
    }

    return (
      <svg className="svg icon--spinner" width={this.props.size} height={this.props.size} viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
            <stop stopColor={color} stopOpacity="0" offset="0%" />
            <stop stopColor={color} stopOpacity=".631" offset="63.146%" />
            <stop stopColor={color} offset="100%" />
          </linearGradient>
        </defs>
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)">
            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2" />
            <circle fill={color} cx="36" cy="18" r="1" />
          </g>
        </g>
      </svg>
    );
  }

}

Spinner.propTypes = {
    size: PropTypes.number.isRequired,
  };


export default Spinner;
