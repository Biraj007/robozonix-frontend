import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiLoader } from 'react-icons/fi';
import api from '../../services/api';

const ImageUpload = ({ 
  value, 
  onChange, 
  label = 'Upload Image',
  accept = 'image/*',
  maxSize = 5, // MB
  multiple = false,
  className = '' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(value || null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError('');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;
      setPreview(imageUrl);
      onChange?.(imageUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={`image-upload ${className}`}>
      {label && <label className="image-upload-label">{label}</label>}
      
      <div 
        className={`upload-zone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !preview && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="upload-loading">
            <FiLoader className="spin" />
            <span>Uploading...</span>
          </div>
        ) : preview ? (
          <div className="upload-preview">
            <img src={preview} alt="Preview" />
            <button 
              type="button" 
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <FiImage className="upload-icon" />
            <span>Drop image here or click to upload</span>
            <small>Max size: {maxSize}MB</small>
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
};

export default ImageUpload;
