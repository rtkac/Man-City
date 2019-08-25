import React from 'react';
import NotFoundImg from '../Resources/images/not-found.png';

const NotFound = () => {
  return (
    <div
      className="not_found_container"
      style={{
        background: `url(${NotFoundImg}) no-repeat`,
        backgroundPosition: '45% center',
        backgroundSize: '400px'
      }}
    >
      <h1>404</h1>
      <h2>Page not found</h2>
    </div>
  )
}

export default NotFound;