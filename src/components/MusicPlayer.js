import React from 'react';
import './MusicPlayer.css';

const MusicPlayer = ({ 
  isPlaying, 
  currentTime, 
  duration, 
  onPlayPause, 
  onSeek, 
  trackTitle = "Music" 
}) => {
  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!duration || !onSeek) return;
    
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickPercent = clickX / progressWidth;
    const newTime = clickPercent * duration;
    
    onSeek(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-player">
      <div className="music-info">
        <span className="track-title">{trackTitle}</span>
      </div>
      
      <div className="music-controls">
        <button 
          className="play-pause-btn" 
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <div className="progress-container">
          <span className="time-current">{formatTime(currentTime)}</span>
          
          <div 
            className="progress-bar" 
            onClick={handleProgressClick}
          >
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className="progress-thumb" 
              style={{ left: `${progressPercent}%` }}
            />
          </div>
          
          <span className="time-duration">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;