import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Stack,
  InputAdornment,
  Divider,
  Alert,
} from "@mui/material";
import { Person, VpnKey, Business } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { login } from "../store/authSlice";
import { useEffect } from "react";
import apiClient from "../api/axiosClient";

const loginSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(4, "La contraseña debe tener al menos 4 caracteres"),
});

type LoginInputs = z.infer<typeof loginSchema>;

const Login = () => {
  useEffect(() => {
    apiClient.get("/api/auth/login").then((res) => {
      console.log(res);
    });
  }, []);

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
        // height: "100vh",
        display: "flex",
        background: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 6,
          color: "white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Business sx={{ fontSize: 80, mb: 3, opacity: 0.95 }} />
          <Typography
            variant="h3"
            fontWeight="700"
            gutterBottom
            sx={{ letterSpacing: "-0.5px" }}
          >
            Enterprise Portal
          </Typography>
          <Typography
            variant="h6"
            sx={{ opacity: 0.9, fontWeight: 300, maxWidth: 400, mx: "auto" }}
          >
            Sistema de Gestión Integral de Recursos Humanos
          </Typography>
          <Box sx={{ mt: 6, opacity: 0.8 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Control de personal centralizado
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Reportes en tiempo real
            </Typography>
            <Typography variant="body2">
              • Seguridad empresarial garantizada
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: "white",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight="600"
                color="text.primary"
                gutterBottom
              >
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ingrese sus credenciales corporativas para acceder al sistema
              </Typography>
            </Box>

            {/* Alert Demo */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="caption" display="block" fontWeight="500">
                Cuenta Demo: <strong>admin</strong> / <strong>1234</strong>
              </Typography>
            </Alert>

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Usuario"
                  placeholder="Ingrese su usuario"
                  autoComplete="username"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                />

                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VpnKey sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "#fafafa",
                    },
                  }}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                    boxShadow: "0 4px 12px rgba(30, 60, 114, 0.25)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(30, 60, 114, 0.35)",
                      background:
                        "linear-gradient(135deg, #1a3461 0%, #245087 100%)",
                    },
                  }}
                >
                  Acceder al Sistema
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Footer */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="caption" color="text.secondary">
                © 2024 Enterprise Portal. Todos los derechos reservados.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
