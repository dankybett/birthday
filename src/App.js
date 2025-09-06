import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import WelcomeScreen from './components/WelcomeScreen';
import ImageGallery from './components/ImageGallery';
import PhotoStack from './components/PhotoStack';
import ZumbaVideo from './components/ZumbaVideo';
import MusicPlayer from './components/MusicPlayer';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [showPhotoStack, setShowPhotoStack] = useState(false);
  const [showZumbaVideo, setShowZumbaVideo] = useState(false);
  const [currentAudioSrc, setCurrentAudioSrc] = useState(null);
  const [currentTrackTitle, setCurrentTrackTitle] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const audioRef = useRef(null);

  const handleWelcomeTouch = () => {
    setShowWelcome(false);
  };

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleImageClick = (audioSrc, trackTitle, index) => {
    console.log('Image clicked - Audio:', audioSrc, 'Title:', trackTitle, 'Index:', index);
    // Stop previous audio before starting new one
    stopCurrentAudio();
    setCurrentAudioSrc(audioSrc);
    setCurrentTrackTitle(trackTitle);
    setGalleryIndex(index);
    
    // Check if this is the Zumba track
    if (trackTitle === 'Zumba K-Pop Mix') {
      setShowZumbaVideo(true);
    } else {
      setShowPhotoStack(true);
    }
  };

  const handleGiftAudio = (audioSrc, trackTitle) => {
    console.log('Gift audio - Audio:', audioSrc, 'Title:', trackTitle);
    // Stop previous audio before starting new one
    stopCurrentAudio();
    // Only start music, don't switch to PhotoStack
    setCurrentAudioSrc(audioSrc);
    setCurrentTrackTitle(trackTitle);
    // Keep showPhotoStack as false to stay in gallery
  };

  const handlePhotoStackExit = () => {
    // Don't stop the music - just return to gallery
    // Music will continue playing and show controls in ImageGallery
    setShowPhotoStack(false);
  };

  const handleZumbaVideoExit = () => {
    // Don't stop the music - just return to gallery
    // Music will continue playing and show controls in ImageGallery
    setShowZumbaVideo(false);
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('Manual play failed:', error);
      });
    }
  };

  const handleStopMusic = () => {
    stopCurrentAudio();
    setCurrentAudioSrc(null);
    setCurrentTrackTitle('');
  };

  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    if (currentAudioSrc && audioRef.current) {
      console.log('Loading audio:', currentAudioSrc);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      
      const audio = audioRef.current;
      audio.src = currentAudioSrc;
      audio.load();
      
      // Set up event listeners for this audio load
      const handleCanPlay = () => {
        console.log('Audio can play, attempting to start');
        audio.play().then(() => {
          console.log('Audio started playing successfully');
          setIsPlaying(true);
        }).catch(error => {
          console.log('Audio auto-play failed:', error);
        });
        audio.removeEventListener('canplay', handleCanPlay);
      };
      
      const handleError = () => {
        console.log('Audio loading error');
        audio.removeEventListener('error', handleError);
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [currentAudioSrc]);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  return (
    <div className="App">
      {showWelcome ? (
        <WelcomeScreen onTouch={handleWelcomeTouch} />
      ) : showPhotoStack ? (
        <>
          <PhotoStack onExit={handlePhotoStackExit} />
          {currentAudioSrc && (
            <MusicPlayer
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              trackTitle={currentTrackTitle}
            />
          )}
        </>
      ) : showZumbaVideo ? (
        <>
          <ZumbaVideo onExit={handleZumbaVideoExit} />
          {currentAudioSrc && (
            <MusicPlayer
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              trackTitle={currentTrackTitle}
            />
          )}
        </>
      ) : (
        <>
          <ImageGallery 
            onImageClick={handleImageClick} 
            onGiftAudio={handleGiftAudio}
            initialIndex={galleryIndex}
          />
          {currentAudioSrc && !showPhotoStack && !showZumbaVideo && (
            <MusicPlayer
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={handlePlayPause}
              onSeek={handleSeek}
              trackTitle={currentTrackTitle}
            />
          )}
        </>
      )}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </div>
  );
}

export default App;