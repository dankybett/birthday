import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onTouch }) => {
  return (
    <div className="welcome-screen" onClick={onTouch} onTouchStart={onTouch}>
      <div className="welcome-content">
        <h1>Welcome!</h1>
        <p>Touch to continue</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;