import React, { PropTypes, PureComponent } from 'react';

import Spinner from './Spinner';


class LoadingOverlay extends PureComponent {

  render() {
    const { message, icon } = this.props;
    return (
      <div>
        <div className="loading_container">
          <div className="container__body">
            <div className="container__message">
              { message }
            </div>
            <div className="container__icon">
              { icon }
            </div>
          </div>
        </div>
        <div className="overlay" />
      </div>
    );
  }

}

LoadingOverlay.defaultProps = {
    icon: <Spinner size={30} />,
    message: 'Loading...',
  };

LoadingOverlay.propTypes = {
    icon: PropTypes.element,
    message: PropTypes.string,
  };


export default LoadingOverlay;
