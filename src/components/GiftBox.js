import React, { useState, useEffect } from 'react';
import './GiftBox.css';

const GiftBox = ({ onClick, onFirstClick, resetKey }) => {
  const [stage, setStage] = useState(1); // 1: closed, 2: bow undone, 3: lid open, 4: ticket revealed

  // Reset the gift when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setStage(1);
    }
  }, [resetKey]);

  const handleClick = () => {
    if (stage === 1) {
      // First click: bow undone + start music
      setStage(2);
      if (onFirstClick) {
        onFirstClick();
      }
    } else if (stage === 2) {
      // Second click: lid open
      setStage(3);
    } else if (stage === 3) {
      // Third click: reveal ticket
      setStage(4);
      
      // Show ticket for a few seconds, then trigger onClick callback
      setTimeout(() => {
        if (onClick) {
          onClick();
        }
      }, 3000); // Show ticket for 3 seconds
    }
  };

  const getInstructionText = () => {
    switch (stage) {
      case 1:
        return "Tap to untie the bow!";
      case 2:
        return "Tap to open the lid!";
      case 3:
        return "Tap to reveal your gift!";
      case 4:
        return "Enjoy your surprise! 🎫";
      default:
        return "Tap to open your present!";
    }
  };

  const getPresentImage = () => {
    switch (stage) {
      case 1:
        return "/present1.png";
      case 2:
        return "/present2_bow_undone.png";
      case 3:
        return "/present3_lid_open.png";
      default:
        return "/present1.png";
    }
  };

  if (stage === 4) {
    return (
      <>
        <div className="image-info">
          <h3>Your Birthday Present</h3>
          <p>Tap to open</p>
        </div>
        <div className="gift-container">
          <div className="present-and-ticket">
            <img 
              src="/present3_lid_open.png" 
              alt="Opened Present" 
              className="present-image background-present"
            />
            <div className="ticket-emerging">
              <img src="/ticket2.png" alt="Birthday Ticket" className="ticket-image" />
              <div className="ticket-shine"></div>
            </div>
          </div>
          <div className="gift-instruction">
            {getInstructionText()}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="image-info">
        <h3>Your Birthday Present</h3>
        <p>Tap to open</p>
      </div>
      <div className="gift-container" onClick={handleClick}>
        <div className="present-wrapper">
          <img 
            src={getPresentImage()} 
            alt="Birthday Present" 
            className="present-image"
          />
          
          {/* Sparkles */}
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">✨</div>
          <div className="sparkle sparkle-3">✨</div>
        </div>
        
        <div className="gift-instruction">
          {getInstructionText()}
        </div>
      </div>
    </>
  );
};

export default GiftBox;