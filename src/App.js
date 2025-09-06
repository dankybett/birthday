import React, { useState } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import ImageGallery from './components/ImageGallery';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeTouch = () => {
    setShowWelcome(false);
  };

  return (
    <div className="App">
      {showWelcome ? (
        <WelcomeScreen onTouch={handleWelcomeTouch} />
      ) : (
        <ImageGallery />
      )}
    </div>
  );
}

export default App;