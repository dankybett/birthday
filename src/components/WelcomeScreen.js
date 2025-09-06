import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onTouch }) => {
  return (
    <div className="welcome-screen" onClick={onTouch} onTouchStart={onTouch}>
      <div className="welcome-content">
        <img src="/HappyBirthday.png" alt="Happy Birthday" className="birthday-image" />
        <p>Touch to continue</p>
      </div>
    </div>
  );
};

export default WelcomeScreen;