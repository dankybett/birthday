import React, { useState, useEffect } from 'react';
import './PhotoStack.css';

const PhotoStack = ({ onExit }) => {
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  const allPhotos = [
    { src: '/images/IMG_20140628_6853_Glastonbury.JPG', date: '2014-06-28', location: 'Glastonbury' },
    { src: '/images/IMG_20150912_8620_Thailand.JPG', date: '2015-09-12', location: 'Thailand' },
    { src: '/images/IMG_20161013_125239_Lisbon.jpg', date: '2016-10-13', location: 'Lisbon' },
    { src: '/images/IMG_20170527_201715_Suffolk.jpg', date: '2017-05-27', location: 'Suffolk' },
    { src: '/images/IMG_20170819_152654_Dublin.jpg', date: '2017-08-19', location: 'Dublin' },
    { src: '/images/IMG_20171028_195124_Octagon_Days.jpg', date: '2017-10-28', location: 'Octagon Days' },
    { src: '/images/IMG_20181013_113530_Japan.jpg', date: '2018-10-13', location: 'Japan' },
    { src: '/images/IMG_20181013_113716_Japan.jpg', date: '2018-10-13', location: 'Japan' },
    { src: '/images/IMG_20181013_170345_Japan.jpg', date: '2018-10-13', location: 'Japan' },
    { src: '/images/IMG_20181014_124912_Japan.jpg', date: '2018-10-14', location: 'Japan' },
    { src: '/images/IMG_20190308_135145_Italy.jpg', date: '2019-03-08', location: 'Italy' },
    { src: '/images/IMG_20190309_113439_Italy.jpg', date: '2019-03-09', location: 'Italy' },
    { src: '/images/IMG_20200813_174619_Leahurst_Days.jpg', date: '2020-08-13', location: 'Leahurst Days' },
    { src: '/images/IMG_20200820_164145_Cotswolds.jpg', date: '2020-08-20', location: 'Cotswolds' },
    { src: '/images/IMG_20240506_114928757_Galway.jpg', date: '2024-05-06', location: 'Galway' },
    { src: '/images/IMG_20240506_114934589_Galway.jpg', date: '2024-05-06', location: 'Galway' },
    { src: '/images/IMG_20240920_200706775_Hastings.jpg', date: '2024-09-20', location: 'Hastings' },
    { src: '/images/IMG-20240912-WA0001_Our_House.jpg', date: '2024-09-12', location: 'Our House' },
    { src: '/images/IMG-20240926-WA0010_Hastings.jpg', date: '2024-09-26', location: 'Hastings' },
    { src: '/images/IMG-20240926-WA0012_Hastings.jpg', date: '2024-09-26', location: 'Hastings' }
  ];

  const getRandomRotation = () => {
    return Math.random() * 20 - 10; // Random rotation between -10 and 10 degrees
  };

  const getRandomPosition = () => {
    return {
      x: Math.random() * 40 - 20, // Random x offset between -20px and 20px
      y: Math.random() * 40 - 20, // Random y offset between -20px and 20px
    };
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const formatDateForPolaroid = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  useEffect(() => {
    const shuffledPhotos = shuffleArray(allPhotos);
    const initialPhotos = shuffledPhotos.slice(0, 5).map((photo, index) => ({
      src: photo.src,
      date: photo.date,
      location: photo.location,
      id: index,
      rotation: getRandomRotation(),
      position: getRandomPosition(),
      zIndex: 5 - index,
      opacity: 1 - (index * 0.1)
    }));
    setCurrentPhotos(initialPhotos);
    setPhotoIndex(5);
  }, []);

  const advanceToNextPhoto = () => {
    setCurrentPhotos(prevPhotos => {
      // Create a completely new array with fresh photos
      const nextPhoto = allPhotos[photoIndex % allPhotos.length];
      
      // Create new photos array, shifting positions
      const newPhotos = prevPhotos.slice(1).map((photo, index) => ({
        ...photo,
        id: photo.id,
        zIndex: 5 - index,
        opacity: 1 - (index * 0.1),
        fadeOut: false,
        slideIn: false
      }));
      
      // Add new photo at the bottom
      newPhotos.push({
        src: nextPhoto.src,
        date: nextPhoto.date,
        location: nextPhoto.location,
        id: Date.now(),
        rotation: getRandomRotation(),
        position: getRandomPosition(),
        zIndex: 1,
        opacity: 0.6,
        slideIn: true,
        fadeOut: false
      });
      
      return newPhotos;
    });
    
    setPhotoIndex(prev => prev + 1);
  };

  const handleBackgroundClick = (e) => {
    // Only exit if clicking on the background, not on a polaroid
    if (e.target === e.currentTarget && onExit) {
      onExit();
    }
  };

  const handlePolaroidClick = (e) => {
    e.stopPropagation(); // Prevent background click
    advanceToNextPhoto();
  };

  return (
    <div className="photo-stack-container" onClick={handleBackgroundClick}>
      <div className="photo-stack">
        {currentPhotos.map((photo) => (
          <div
            key={photo.id}
            className={`polaroid ${photo.fadeOut ? 'fade-out' : ''} ${photo.slideIn ? 'slide-in' : ''}`}
            style={{
              transform: `rotate(${photo.rotation}deg) translate(${photo.position.x}px, ${photo.position.y}px)`,
              zIndex: photo.zIndex,
              opacity: photo.opacity
            }}
            onClick={handlePolaroidClick}
          >
            <div className="photo-frame">
              <img src={photo.src} alt="Memory" />
              <div className="photo-caption">
                <div className="caption-date">{formatDateForPolaroid(photo.date)}</div>
                <div className="caption-location">{photo.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="instruction-text">
        Tap photos to advance • Tap background to exit
      </div>
    </div>
  );
};

export default PhotoStack;