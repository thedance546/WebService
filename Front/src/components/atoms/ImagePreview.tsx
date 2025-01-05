// src/components/atoms/ImagePreview.tsx

interface ImagePreviewProps {
  src?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = '미리보기',
  className = '',
  style = {},
}) => (
  <div
    className={`border rounded p-3 mt-3 ${className}`}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      ...style,
    }}
  >
    {src ? (
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    ) : (
      <span>{alt}</span>
    )}
  </div>
);

export default ImagePreview;
