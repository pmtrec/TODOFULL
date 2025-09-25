import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

const ImageUpload = ({ onImageSelect, maxSize = 2 * 1024 * 1024, currentImage = null }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(currentImage);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide');
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      setError(`La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    setError('');
    
    if (!validateFile(file)) {
      return;
    }

    setSelectedImage(file);
    onImageSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError('');
    onImageSelect(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          {error}
        </div>
      )}

      {!imagePreview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary-600">Cliquez pour sélectionner</span>
              {' '}ou glissez-déposez une image
            </div>
            <div className="text-xs text-gray-500">
              PNG, JPG, GIF jusqu'à {formatFileSize(maxSize)}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative bg-gray-50 rounded-lg p-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full h-auto max-h-48 mx-auto rounded-lg shadow-sm"
            />
            
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
              title="Supprimer l'image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {selectedImage && (
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-1" />
                <span>{selectedImage.name}</span>
              </div>
              <span className="text-xs text-gray-500">
                {formatFileSize(selectedImage.size)}
              </span>
            </div>
          )}
          
          {currentImage && !selectedImage && (
            <div className="mt-2 text-sm text-gray-600 flex items-center">
              <ImageIcon className="h-4 w-4 mr-1" />
              <span>Image existante</span>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!imagePreview && (
        <div className="text-xs text-gray-500">
          Formats supportés: JPEG, PNG, GIF. Taille maximale: {formatFileSize(maxSize)}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;