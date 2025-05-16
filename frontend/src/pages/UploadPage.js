import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  TextField,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit,
  CheckCircle,
  Error,
  AddPhotoAlternate
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { createPhoto } from '../services/photo.js';

const SingleImageUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    tags: [],
    image: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(Object.assign(file, {
          preview: URL.createObjectURL(file),
          id: Math.random().toString(36).substring(2, 9)
        }));
        // Auto-generate title from filename
        if (!metadata.title) {
          const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          setMetadata(prev => ({
            ...prev,
            title: nameWithoutExt.replace(/[-_]/g, ' ')
          }));
        }
      }
    }
  });

  const removeFile = () => {
    if (file) URL.revokeObjectURL(file.preview);
    setFile(null);
    setUploadResult(null);
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = (tag) => {
    if (tag && !metadata.tags.includes(tag)) {
      setMetadata(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!file) return;
    console.log("-->  file", file);
    setMetadata({...metadata, image: file});
    
    console.log("metadata", metadata); 
    setIsUploading(true);
    setUploadResult(null);
    setUploadProgress(50);
    metadata["image"] = file;
    console.log("mmm", metadata);
    await createPhoto(metadata);
    setIsUploading(false); 
    setUploadResult({ success: true, message: 'Image uploaded successfully!', data: { file, metadata } }); 
    setUploadProgress(100);
  };

  React.useEffect(() => {
    console.log("changing file", file);
    return () => {
      if (file) URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  return ( 
    <Box sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom sx={{ 
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <AddPhotoAlternate fontSize="large" />
        Upload Image
      </Typography>
      
      <Card elevation={2}>
        <CardContent>
          {/* Upload Zone */}
          {!file ? (
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'divider',
                borderRadius: 2,
                p: 6,
                textAlign: 'center',
                backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input {...getInputProps()} />
              <CloudUpload fontSize="large" color={isDragActive ? 'primary' : 'action'} />
              <Typography variant="h6" sx={{ mt: 1 }}>
                {isDragActive ? 'Drop image here' : 'Drag & drop an image'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Supports JPEG, PNG, WEBP (Max 10MB)
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Select Image
              </Button>
            </Box>
          ) : (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                position: 'relative',
                borderRadius: 2,
                overflow: 'hidden',
                mb: 2
              }}>
                <Box
                  component="img"
                  src={file.preview}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
                <IconButton
                  onClick={removeFile}
                  color="error"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'background.paper'
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle2">
                  {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
                <Button 
                  size="small" 
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit Details'}
                </Button>
              </Box>
            </Box>
          )}

          {/* Metadata Form */}
          {(file || isEditing) && (
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle1" gutterBottom>
                Image Details
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={metadata.title}
                    onChange={handleMetadataChange}
                    margin="normal"
                    required
                  />
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Description"
                    name="description"
                    value={metadata.description}
                    onChange={handleMetadataChange}
                    margin="normal"
                  />
                </Box>

                <Box sx={{ width: 200 }}>
                  <Typography variant="body2" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1,
                    minHeight: 100
                  }}>
                    {metadata.tags.length > 0 ? (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {metadata.tags.map(tag => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            onDelete={() => handleTagRemove(tag)}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No tags added
                      </Typography>
                    )}
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Add tag..."
                    sx={{ mt: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleTagAdd(e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" gutterBottom>
                Uploading image...
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{ height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" sx={{ 
                display: 'block', 
                textAlign: 'right', 
                mt: 0.5 
              }}>
                {uploadProgress}%
              </Typography>
            </Box>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <Alert
              severity={uploadResult.success ? 'success' : 'error'}
              icon={uploadResult.success ? <CheckCircle /> : <Error />}
              sx={{ mb: 3 }}
              onClose={() => setUploadResult(null)}
            >
              {uploadResult.message}
              {uploadResult.success && (
                <Button 
                  size="small" 
                  sx={{ ml: 2 }}
                  onClick={removeFile}
                >
                  Upload Another
                </Button>
              )}
            </Alert>
          )}

          {/* Submit Button */}
          {file && !uploadResult?.success && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={isUploading || !metadata.title}
                startIcon={<CloudUpload />}
                sx={{ minWidth: 200 }}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SingleImageUpload;
