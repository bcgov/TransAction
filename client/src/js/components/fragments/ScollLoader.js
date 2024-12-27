import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import _ from 'lodash';

const ScrollLoader = ({ children, page, pageCount, loader, shouldLoad }) => {
  const scrollListener = useCallback(
    _.debounce(() => {
      if (window.innerHeight + window.pageYOffset >= document.documentElement.offsetHeight) {
        // Scrolled to the bottom
        if (shouldLoad && loader) loader();
      }
    }, 100), [shouldLoad, loader]
  );
  useEffect(() => {
    window.addEventListener('scroll', scrollListener);
    window.addEventListener('wheel', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('wheel', scrollListener);
    };
  }, [scrollListener]);

  return (
    <>
      {children}
      {shouldLoad && page < pageCount && (
        <div className="text-center mb-5">
          <Button color="primary" onClick={loader}>
            More
          </Button>
        </div>
      )}
    </>
  );
};

ScrollLoader.propTypes = {
  shouldLoad: PropTypes.bool,
  //Added more propTypes to ensure that the component receives props of the correct type
  children: PropTypes.node.isRequired,
  page: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  loader: PropTypes.func.isRequired,
};

ScrollLoader.defaultProps = { shouldLoad: true };

export default ScrollLoader;
