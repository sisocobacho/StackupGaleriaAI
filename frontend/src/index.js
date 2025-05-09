import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline } from '@mui/material';
import galleryTheme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
 <ThemeProvider theme={galleryTheme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
  </React.StrictMode>
);
