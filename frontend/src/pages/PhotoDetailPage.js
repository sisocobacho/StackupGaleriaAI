import React, { useEffect, useState } from 'react';
import { link, useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip,
  Button,
  CircularProgress,
  Grid,
  Divider
} from '@mui/material';
import { fetchPhoto } from '../services/photo.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';


const PhotoDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPhoto = async () => {
      try {
        const response = await fetchPhoto(id);
        setPhoto(response.data);
      } catch (err) {
        setError('Failed to load photo');
        console.error('Error fetching photo:', err);
      } finally {
        setLoading(false);
      }
    };
    getPhoto();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!photo) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Photo not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Gallery
      </Button>

      <Card elevation={3}>
        <CardMedia
          component="img"
          height="500"
          image={photo.image}
          alt={photo.title}
          sx={{ objectFit: 'contain' }}
        />
        
        <CardContent>
          <Typography gutterBottom variant="h4" component="h1">
            {photo.title}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item>
              <Typography variant="subtitle1" color="text.secondary">
                Uploaded by: {photo.user.username}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" color="text.secondary">
                {format(new Date(photo.uploaded_at), 'MMMM d, yyyy - h:mm a')}
              </Typography>
            </Grid>
          </Grid>

          {photo.description && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {photo.description}
              </Typography>
            </>
          )}

          {photo.tags && photo.tags.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {photo.tags.map((tag) => (
                  <Chip key={tag.id} label={tag.tag} variant="outlined" />
                ))}
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PhotoDetailPage;
