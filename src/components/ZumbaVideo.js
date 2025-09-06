import React, { useRef, useEffect } from 'react';
import './ZumbaVideo.css';

const ZumbaVideo = ({ onExit }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video auto-play failed:', error);
      });
    }
  }, []);

  const handleBackgroundClick = (e) => {
    // Only exit if clicking on the background, not on the video
    if (e.target === e.currentTarget && onExit) {
      onExit();
    }
  };

  const handleVideoClick = (e) => {
    e.stopPropagation(); // Prevent background click
  };

  return (
    <div className="zumba-video-container" onClick={handleBackgroundClick}>
      <div className="zumba-video-wrapper">
        <video
          ref={videoRef}
          className="zumba-video"
          loop
          muted
          playsInline
          onClick={handleVideoClick}
        >
          <source src="/zumbavideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="video-instruction-text">
        Tap background to exit
      </div>
    </div>
  );
};

export default ZumbaVideo;