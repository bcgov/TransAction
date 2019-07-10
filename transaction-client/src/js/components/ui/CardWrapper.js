import React from 'react';

const CardWrapper = ({ children, style }) => {
  return (
    <div className="card-wrapper" style={style}>
      {children}
    </div>
  );
};

export default CardWrapper;
