import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = () => {
    // LOGIN DUMMY
    if (credentials.username === 'admin' && credentials.password === '1234') {
      dispatch(login({ name: 'Administrador' }));
      enqueueSnackbar('Bienvenido al sistema', { variant: 'success' });
      navigate('/dashboard');
    } else {
      enqueueSnackbar('Credenciales incorrectas (Usa: admin / 1234)', { variant: 'error' });
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={10} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Prueba Técnica Full Stack
          </Typography>
          
          <TextField
            fullWidth
            label="Usuario"
            margin="normal"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            margin="normal"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          
          <Button 
            fullWidth 
            variant="contained" 
            size="large" 
            sx={{ mt: 3, borderRadius: 2 }}
            onClick={handleLogin}
          >
            Ingresar
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Demo: admin / 1234
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;