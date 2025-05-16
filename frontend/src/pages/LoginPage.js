import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Divider, 
  Alert,
  Container,
  Paper,
  Stack
} from '@mui/material';
import { Lock, Person, Email } from '@mui/icons-material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { login } from '../services/auth';
import { LoadingButton } from '@mui/lab';

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState(null);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const response = await login(values);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Lock color="primary" sx={{ fontSize: 60 }} />
          <Typography variant="h4" component="h1" sx={{ mt: 2, fontWeight: 600 }}>
            Sign In
          </Typography>
          <Typography color="text.secondary">
            Access your photo gallery account
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, isSubmitting }) => (
            <Form>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  InputProps={{
                    startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    startAdornment: <Lock sx={{ color: 'action.active', mr: 1 }} />
                  }}
                />

                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  sx={{ py: 1.5 }}
                >
                  Sign In
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Link href="/forgot-password" variant="body2" underline="hover">
            Forgot password?
          </Link>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link href="/register" underline="hover" fontWeight="medium">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
