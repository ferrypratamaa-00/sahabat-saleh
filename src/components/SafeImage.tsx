import React from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, onError }) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
    if (onError) onError();
  };

  if (hasError) {
    return (
      <div className={`safe-image-placeholder ${className}`}>
        <span>🖼️</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

export default SafeImage;