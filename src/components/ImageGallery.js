import React, { useState, useRef, useEffect, useMemo } from 'react';
import './ImageGallery.css';

const ImageGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const mediaItems = useMemo(() => [
    {
      image: 'https://picsum.photos/400/600?random=1',
      audio: '/birthday-song.mp3',
      title: 'Happy Birthday!'
    },
    {
      image: 'https://picsum.photos/400/600?random=2',
      audio: '/Baroque.mp3',
      title: 'Classical Baroque'
    },
    {
      image: 'https://picsum.photos/400/600?random=3',
      audio: '/Kpop1.mp3',
      title: 'K-Pop Vibes'
    },
    {
      image: 'https://picsum.photos/400/600?random=4',
      audio: '/Kpop2.mp3',
      title: 'More K-Pop'
    },
    {
      image: 'https://picsum.photos/400/600?random=5',
      audio: '/Rock.mp3',
      title: 'Rock Anthems'
    },
    {
      image: 'https://picsum.photos/400/600?random=6',
      audio: '/Zumba X Kpop.mp3',
      title: 'Zumba K-Pop Mix'
    }
  ], []);

  const handleImageClick = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          // Reset to beginning if ended
          if (audioRef.current.ended) {
            audioRef.current.currentTime = 0;
          }
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.log('Audio play failed:', error);
        // Try to load the audio again
        if (audioRef.current) {
          audioRef.current.load();
          setAudioLoaded(false);
        }
      }
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

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      // Set up event listeners
      const handleLoadedData = () => setAudioLoaded(true);
      const handleEnded = () => setIsPlaying(false);
      const handleError = (e) => {
        console.log('Audio loading error:', e);
        setAudioLoaded(false);
        setIsPlaying(false);
      };
      
      audio.addEventListener('loadeddata', handleLoadedData);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      // Set the audio source
      audio.src = mediaItems[currentIndex].audio;
      audio.load(); // Explicitly load the audio
      
      // Cleanup function
      return () => {
        audio.removeEventListener('loadeddata', handleLoadedData);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [currentIndex, mediaItems]);

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
              <img
                src={item.image}
                alt={item.title}
                onClick={handleImageClick}
                className={`gallery-image ${isPlaying ? 'playing' : ''}`}
              />
              <div className="image-info">
                <h3>{item.title}</h3>
                <p>{audioLoaded ? 'Tap image to play music' : 'Loading audio...'}</p>
                {isPlaying && <p>🎵 Playing...</p>}
              </div>
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
      
      <audio 
        ref={audioRef} 
        preload="metadata"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default ImageGallery;