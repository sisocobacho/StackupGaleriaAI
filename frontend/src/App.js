import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import PhotoDetailPage from './pages/PhotoDetailPage';
import UploadPage from './pages/UploadPage';
import LoginPage from './pages/LoginPage.js';
import NavBar from './components/NavBar';
import AuthRoute from './components/AuthRoute.js';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<AuthRoute/>}>
            <Route path="/photos/:id" element={<PhotoDetailPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
