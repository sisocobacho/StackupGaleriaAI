import { createTheme } from '@mui/material/styles';

const galleryTheme = createTheme({
  palette: {
    mode: 'light', // or 'dark' for dark mode
    primary: {
      main: '#2d3436', // Elegant dark gray
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#a29bfe', // Soft purple
      contrastText: '#2d3436'
    },
    background: {
      default: '#f5f6fa', // Very light gray
      paper: '#ffffff' // Pure white for cards
    },
    text: {
      primary: '#2d3436', // Dark gray for text
      secondary: '#636e72' // Medium gray for secondary text
    },
    divider: '#dfe6e9' // Very subtle divider
  },
  typography: {
    fontFamily: [
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem'
    },
    h4: {
      fontWeight: 500,
      letterSpacing: '0.5px'
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)'
          }
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          letterSpacing: '0.5px'
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    }
  }
});

export default galleryTheme;
