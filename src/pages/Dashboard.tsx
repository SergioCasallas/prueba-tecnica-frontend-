import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Stack,
  Chip,
  Avatar,
  Divider,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import {
  Edit,
  Delete,
  Add,
  ExitToApp,
  Business,
  People,
  PersonAdd,
  FilterList,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { logout } from "../store/authSlice";
import type { Persona } from "../types/index";
import {
  getPeople,
  postPeople,
  patchPeople,
  deletePeople,
} from "../services/people";

const personaSchema = z.object({
  tipo_documento: z.string().min(1, "Seleccione un tipo de documento"),
  documento: z
    .string()
    .min(5, "El documento debe tener al menos 5 caracteres")
    .regex(/^\d+$/, "El documento solo debe contener números"),
  nombres: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  apellidos: z.string().min(3, "El apellido debe tener al menos 3 caracteres"),
  hobbie: z.string().min(3, "El hobbie es requerido"),
});

type PersonaFormInputs = z.infer<typeof personaSchema>;

const Dashboard = () => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeople = async () => {
      try {
        const response = await getPeople();
        setPersonas(response);
      } catch (error) {
        console.error("Error fetching people:", error);
      }
    };
    fetchPeople();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonaFormInputs>({
    resolver: zodResolver(personaSchema),
    defaultValues: {
      tipo_documento: "",
      documento: "",
      nombres: "",
      apellidos: "",
      hobbie: "",
    },
  });

  const onSubmit: SubmitHandler<PersonaFormInputs> = async (data) => {
    if (editingId !== null) {
      setPersonas((prev) =>
        prev.map((p) => (p.id === editingId ? { ...data, id: editingId } : p))
      );
      const updatedPersona: Persona = {
        ...data,
        id: editingId,
      };
      enqueueSnackbar("Persona actualizada correctamente", {
        variant: "success",
      });
      await patchPeople(updatedPersona);
    } else {
      const newPersona: Persona = {
        ...data,
        id: Math.floor(Math.random() * 1000000),
      };
      await postPeople(newPersona);
      setPersonas((prev) => [...prev, newPersona]);
      enqueueSnackbar("Persona creada correctamente", { variant: "success" });
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Está seguro de eliminar este registro?")) {
      deletePeople(id);
      setPersonas((prev) => prev.filter((p) => p.id !== id));
      enqueueSnackbar("Registro eliminado", { variant: "warning" });
    }
  };

  const handleOpenModal = (persona?: Persona) => {
    if (persona) {
      setEditingId(persona.id || null);
      reset({
        tipo_documento: persona.tipo_documento,
        documento: persona.documento,
        nombres: persona.nombres,
        apellidos: persona.apellidos,
        hobbie: persona.hobbie,
      });
    } else {
      setEditingId(null);
      reset({
        tipo_documento: "",
        documento: "",
        nombres: "",
        apellidos: "",
        hobbie: "",
      });
    }
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    reset();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const getInitials = (nombres: string, apellidos: string) => {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#f5f7fa", overflow: "hidden" }}>
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          flexShrink: 0,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              py: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Business sx={{ fontSize: 32, color: "#1e3c72" }} />
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="700"
                  color="text.primary"
                  sx={{ lineHeight: 1.2 }}
                >
                  Enterprise Portal
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Sistema de Gestión de Personal
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                avatar={<Avatar sx={{ bgcolor: "#1e3c72" }}>A</Avatar>}
                label="Administrador"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                startIcon={<ExitToApp />}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e3f2fd",
                      color: "#1976d2",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="700">
                      {personas.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Personal Registrado
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#f3e5f5",
                      color: "#9c27b0",
                      width: 48,
                      height: 48,
                    }}
                  >
                    <PersonAdd />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" fontWeight="700">
                      +{personas.length > 0 ? personas.length : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Empleados
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              bgcolor: "#fafbfc",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight="700" color="text.primary">
                Directorio de Personal
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestión completa de empleados y colaboradores
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenModal()}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  bgcolor: "#1e3c72",
                  "&:hover": { bgcolor: "#1a3461" },
                }}
              >
                Nuevo Empleado
              </Button>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafbfc" }}>
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>
                    EMPLEADO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>
                    DOCUMENTO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>
                    TIPO
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "text.secondary" }}>
                    INTERESES
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "text.secondary" }}
                  >
                    ACCIONES
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personas.length > 0 ? (
                  personas.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:hover": { bgcolor: "#f8f9fa" },
                        borderBottom: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: "#1e3c72",
                              width: 40,
                              height: 40,
                              fontWeight: 600,
                            }}
                          >
                            {getInitials(row.nombres, row.apellidos)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="600">
                              {row.nombres} {row.apellidos}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Empleado
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="500">
                          {row.documento}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.tipo_documento}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.hobbie}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.5}
                          justifyContent="flex-end"
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleOpenModal(row)}
                            sx={{
                              color: "#1976d2",
                              "&:hover": { bgcolor: "#e3f2fd" },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.id!)}
                            sx={{
                              color: "#d32f2f",
                              "&:hover": { bgcolor: "#ffebee" },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <People
                        sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        No hay empleados registrados
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Comience agregando su primer empleado al sistema
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>

      <Dialog
        open={open}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            borderBottom: "1px solid",
            borderColor: "divider",
            pb: 2,
          }}
        >
          {editingId ? "Editar Empleado" : "Nuevo Empleado"}
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <TextField
                select
                label="Tipo de Documento"
                fullWidth
                {...register("tipo_documento")}
                error={!!errors.tipo_documento}
                helperText={errors.tipo_documento?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fafafa",
                  },
                }}
              >
                <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                <MenuItem value="CE">Cédula de Extranjería</MenuItem>
              </TextField>

              <TextField
                label="Número de Documento"
                fullWidth
                type="number"
                {...register("documento")}
                error={!!errors.documento}
                helperText={errors.documento?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fafafa",
                  },
                }}
              />

              <TextField
                label="Nombres"
                fullWidth
                {...register("nombres")}
                error={!!errors.nombres}
                helperText={errors.nombres?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fafafa",
                  },
                }}
              />

              <TextField
                label="Apellidos"
                fullWidth
                {...register("apellidos")}
                error={!!errors.apellidos}
                helperText={errors.apellidos?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fafafa",
                  },
                }}
              />

              <TextField
                label="Intereses / Hobbies"
                fullWidth
                {...register("hobbie")}
                error={!!errors.hobbie}
                helperText={errors.hobbie?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#fafafa",
                  },
                }}
              />
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ px: 3, py: 2.5 }}>
            <Button
              onClick={handleCloseModal}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#1e3c72",
                "&:hover": { bgcolor: "#1a3461" },
                px: 3,
              }}
            >
              {editingId ? "Actualizar" : "Guardar"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Dashboard;