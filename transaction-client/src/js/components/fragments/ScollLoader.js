import React from 'react';
import _ from 'lodash';

class ScrollLoader extends React.Component {
  componentDidMount() {
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('wheel', this.scrollListener);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('wheel', this.scrollListener);
  }

  scrollListener = _.debounce(() => {
    console.log('window.innerHeight ', window.innerHeight);
    console.log('document.documentElement.scrollTop ', document.documentElement.scrollTop);
    console.log('window.pageYOffset ', window.pageYOffset);
    console.log('document.documentElement.offsetHeight ', document.documentElement.offsetHeight);
    if (window.innerHeight + window.pageYOffset >= document.documentElement.offsetHeight) {
      // Scrolled to the bottom
      if (this.props.loader) this.props.loader();
    }
  }, 100);

  render() {
    return this.props.children;
  }
}

export default ScrollLoader;
