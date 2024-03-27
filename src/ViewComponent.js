import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';

function ViewComponent() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const imageKeys = await Storage.list('');
      setImages(imageKeys);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  return (
    <div>
      {images.map(image => (
        <div key={image.key}>
          <img src={image.key} alt={image.key} />
        </div>
      ))}
    </div>
  );
}

export default ViewComponent;