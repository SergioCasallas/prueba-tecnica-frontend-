import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Avatar,
  Stack,
  InputAdornment,
} from "@mui/material";
import { LockOutlined, Person, VpnKey } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { login } from "../store/authSlice";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

type LoginInputs = z.infer<typeof loginSchema>;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    if (data.username === "admin" && data.password === "1234") {
      dispatch(login({ name: "Administrador" }));
      enqueueSnackbar("Bienvenido al sistema", { variant: "success" });
      navigate("/dashboard");
    } else {
      enqueueSnackbar("Credenciales incorrectas (Prueba: admin / 1234)", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1976d2 0%, #9c27b0 100%)",
        backgroundSize: "cover",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={12}
          sx={{
            p: 4,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)", // Un poco de transparencia
          }}
        >
          <Avatar
            sx={{ m: 1, bgcolor: "secondary.main", width: 56, height: 56 }}
          >
            <LockOutlined fontSize="large" />
          </Avatar>

          <Typography
            component="h1"
            variant="h5"
            fontWeight="bold"
            color="textPrimary"
          >
            Iniciar Sesión
          </Typography>

          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Prueba Técnica Full Stack
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
            noValidate
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Usuario"
                placeholder="admin"
                autoComplete="username"
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                placeholder="1234"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <VpnKey color="action" />
                    </InputAdornment>
                  ),
                }}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 4, mb: 2, borderRadius: 2, py: 1.5, fontSize: "1rem" }}
            >
              Ingresar
            </Button>

            <Box textAlign="center" mt={2}>
              <Typography
                variant="caption"
                color="textSecondary"
                display="block"
              >
                Credenciales Demo:
              </Typography>
              <Typography variant="caption" fontWeight="bold" color="primary">
                admin / 1234
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
