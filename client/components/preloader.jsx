import React, { PureComponent } from 'react';
import classnames from 'classnames';

const PreloaderCircle = ({ className }) => (
  <div className={className}>
    <div className="preloader__loader">
      <svg className="preloader__circular" viewBox="25 25 50 50">
        <circle
          className="preloader__path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeMiterlimit="10"
        />
      </svg>
    </div>
  </div>
);

export default class Preloader extends PureComponent {
  constructor(props) {
    super(props);

    let delay = 1500;

    if (props.delay !== undefined) {
      delay = Number(props.delay);
    }

    if (delay === 0) {
      this.state = { isShow: true };
      this.show();
    } else {
      this.state = { isShow: false };
      this.timer = setTimeout(this.show.bind(this), delay);
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  show() {
    if (!this.state.isShow) {
      this.setState({ isShow: true });
    }
  }

  render() {
    const { className } = this.props || false;
    const preloaderClassName = classnames('preloader', className);

    return this.state.isShow ? <PreloaderCircle className={preloaderClassName} /> : null;
  }
}
