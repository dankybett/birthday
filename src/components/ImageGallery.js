import React, { useState, useRef, useEffect, useMemo } from 'react';
import './ImageGallery.css';
import GiftBox from './GiftBox';

const ImageGallery = ({ onImageClick, onGiftAudio, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [giftResetKey, setGiftResetKey] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const wasOnGiftRef = useRef(false);

  const mediaItems = useMemo(() => [
    {
      image: '/HappyBirthday.png',
      audio: '/birthday-song.mp3',
      title: 'Happy Birthday!'
    },
    {
      image: '/coverart/Kpop1.png',
      audio: '/Kpop1.mp3',
      title: 'K-Pop Vibes'
    },
    {
      image: '/coverart/Slugclub.png',
      audio: '/Rock.mp3',
      title: 'Rock Anthems'
    },
    {
      image: '/coverart/Kpok.png',
      audio: '/Kpop2.mp3',
      title: 'More K-Pop'
    },
    {
      image: '/coverart/Baroque.png',
      audio: '/Baroque.mp3',
      title: 'Classical Baroque'
    },
    {
      image: '/coverart/Zumba1.png',
      audio: '/Zumba X Kpop.mp3',
      title: 'Zumba K-Pop Mix'
    },
    {
      image: 'gift',
      audio: null,
      title: 'Birthday Present!',
      isGift: true
    }
  ], []);

  // Track navigation to/from gift to reset it
  useEffect(() => {
    const isCurrentlyOnGift = mediaItems[currentIndex]?.isGift;
    
    // If we were on the gift and now we're not, or we're back on the gift after being away
    if (wasOnGiftRef.current && !isCurrentlyOnGift) {
      // User navigated away from gift - prepare for reset when they return
      wasOnGiftRef.current = false;
    } else if (!wasOnGiftRef.current && isCurrentlyOnGift) {
      // User returned to gift - reset it
      setGiftResetKey(prev => prev + 1);
      wasOnGiftRef.current = true;
    }
  }, [currentIndex, mediaItems]);

  // Update current index when initial index changes (returning from PhotoStack)
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleImageClick = async () => {
    // Check if this is the gift item
    const currentItem = mediaItems[currentIndex];
    if (currentItem.isGift) {
      // Don't do anything here - let the GiftBox handle its own click
      return;
    }
    
    // Pass the current audio source and title to the parent component
    if (onImageClick) {
      const currentAudio = currentItem.audio;
      const currentTitle = currentItem.title;
      onImageClick(currentAudio, currentTitle, currentIndex);
    }
  };

  const handleGiftClick = () => {
    // This will be called after the gift opening animation
    // We can either go to PhotoStack or stay in gallery - let's stay for now
    console.log('Gift opened! Ticket revealed!');
  };

  const handleGiftFirstClick = () => {
    // Start playing the present opening song when gift is first clicked
    if (onGiftAudio) {
      onGiftAudio('/presentopeningsong.mp3', 'Present Opening Song');
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !e.changedTouches[0]) return;
    
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < mediaItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleWheel = (e) => {
    if (e.deltaX > 0 && currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (e.deltaX < 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  return (
    <div 
      className="image-gallery"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div className="gallery-container">
        <div 
          className="images-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {mediaItems.map((item, index) => (
            <div key={index} className="image-slide">
              {item.isGift ? (
                <GiftBox 
                  onClick={handleGiftClick} 
                  onFirstClick={handleGiftFirstClick}
                  resetKey={giftResetKey}
                />
              ) : (
                <>
                  <div className="image-info">
                    <h3>{item.title}</h3>
                    <p>Tap image to see photos</p>
                  </div>
                  <img
                    src={item.image}
                    alt={item.title}
                    onClick={handleImageClick}
                    className="gallery-image"
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="navigation-dots">
        {mediaItems.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      
    </div>
  );
};

export default ImageGallery;