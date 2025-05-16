import React, { useEffect, useState } from 'react';
import { fetchPhotos } from '../services/photo.js';
import { Link } from 'react-router-dom';
import {
  Container,
  Chip,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  Button,
  Skeleton
} from '@mui/material';
import { Search, FilterList, GridView, ViewList } from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';

const HomePage = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const response = await fetchPhotos();
        setPhotos(response?.data?.results);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    getPhotos();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Gallery Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Photo Gallery
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search photos..."
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />
            }}
          />
          
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
          >
            <ToggleButton value="grid" size="small">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" size="small">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
          
          <Button 
            variant="outlined" 
            startIcon={<FilterList />}
            size="small"
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Photo Grid */}
      {viewMode === 'grid' ? (
        <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={3}>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={200} />
            ))
          ) : (
            photos.map((photo) => (
              <Card key={photo.id} elevation={3} sx={{ 
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: 6,
                  transition: 'all 0.3s ease'
                }
              }}>
                <CardActionArea component={Link} to={`/photos/${photo.id}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={photo.image}
                    alt={photo.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {photo.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          key="tag"
                          label="tag" 
                          size="small" 
                          variant="outlined"
                        />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))
          )}
        </Masonry>
      ) : (
        /* List View Alternative */
        <Grid container spacing={3}>
          {photos.map((photo) => (
            <Grid item xs={12} key={photo.id}>
              <Card sx={{ display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 200, height: 150 }}
                  image={photo.image}
                  alt={photo.title}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6">{photo.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      3 days ago • 24 likes • 5 comments
                    </Typography>
                  </CardContent>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination count={10} color="primary" />
      </Box>
    </Container>
  ); 

};

export default HomePage;
