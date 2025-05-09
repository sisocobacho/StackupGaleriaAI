import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { createPhoto } from '../services/api';

const UploadPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, image: 'File size must be less than 5MB' }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setErrors(prev => ({ ...prev, image: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await createPhoto(formData);
      setSnackbar({
        open: true,
        message: 'Photo uploaded successfully!',
        severity: 'success'
      });
      // Reset form after successful upload
      setFormData({
        title: '',
        description: '',
        image: null
      });
      setPreview(null);
      // Redirect after delay
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload photo';
      if (error.response) {
        // Handle Django backend validation errors
        if (error.response.data) {
          errorMessage = Object.values(error.response.data).join(' ');
        }
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Photo
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '1px dashed',
                  borderColor: errors.image ? 'error.main' : 'divider',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: 'action.hover'
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose Image
                  </Button>
                </label>
                {errors.image && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {errors.image}
                  </Typography>
                )}
                {formData.image && (
                  <Typography sx={{ mt: 1 }}>
                    {formData.image.name}
                  </Typography>
                )}
              </Box>
            </Grid>
            
            {preview && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxHeight: '300px', maxWidth: '100%' }}
                  />
                </Box>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Upload Photo'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UploadPage;
