import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import UploadPage from './pages/UploadPage';
import NavBar from './components/NavBar';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/photos/:id" element={<PhotoDetailPage />} />
          <Route path="/upload" element={<UploadPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
