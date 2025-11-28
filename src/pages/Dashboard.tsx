import React, { useEffect, useState } from "react";
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
  AppBar,
  Toolbar,
  Box,
  Stack,
} from "@mui/material";
import { Edit, Delete, Add, ExitToApp } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { logout } from "../store/authSlice";
import type { Persona } from "../types/index";
import { getPeople } from "../services/people";

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

  const onSubmit: SubmitHandler<PersonaFormInputs> = (data) => {
    if (editingId !== null) {
      setPersonas((prev) =>
        prev.map((p) => (p.id === editingId ? { ...data, id: editingId } : p))
      );
      enqueueSnackbar("Persona actualizada correctamente", {
        variant: "success",
      });
    } else {
      const newPersona: Persona = {
        ...data,
        id: Math.floor(Math.random() * 1000000),
      };
      setPersonas((prev) => [...prev, newPersona]);
      enqueueSnackbar("Persona creada correctamente", { variant: "success" });
    }
    handleCloseModal();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar este registro?")) {
      setPersonas((prev) => prev.filter((p) => p.id !== id));
      enqueueSnackbar("Registro eliminado", { variant: "warning" });
    }
  };

  const handleOpenModal = (persona?: Persona) => {
    if (persona) {
      setEditingId(persona.id || null);
      reset({
        // Asegúrate de que las llaves (izquierda) sean snake_case como en tu Schema
        // Y los valores (derecha) vengan como llegan de la API/Tabla
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

  return (
    <Box
      sx={{ flex: 1, bgcolor: "#f5f5f5", minHeight: "100vh", width: "100%" }}
    >
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Gestión de Personas
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToApp />}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h5" color="textPrimary" fontWeight="500">
              Listado de Personal
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleOpenModal()}
              sx={{ borderRadius: 2, px: 3 }}
            >
              Agregar Persona
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f9fafb" }}>
                  <TableCell>
                    <strong>Tipo Doc</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Documento</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Nombres</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Apellidos</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Hobbie</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personas.length > 0 ? (
                  personas.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>{row.tipo_documento}</TableCell>
                      <TableCell>{row.documento}</TableCell>
                      <TableCell>{row.nombres}</TableCell>
                      <TableCell>{row.apellidos}</TableCell>
                      <TableCell>{row.hobbie}</TableCell>
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenModal(row)}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(row.id!)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        No hay registros disponibles.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>
            {editingId ? "Editar Persona" : "Nueva Persona"}
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent dividers>
              <Stack spacing={2}>
                <TextField
                  select
                  label="Tipo Documento"
                  fullWidth
                  {...register("tipo_documento")}
                  error={!!errors.tipo_documento}
                  helperText={errors.tipo_documento?.message}
                >
                  <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
                  <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
                  <MenuItem value="CE">Cédula de Extranjería</MenuItem>
                </TextField>

                <TextField
                  label="Documento"
                  fullWidth
                  type="number"
                  {...register("documento")}
                  error={!!errors.documento}
                  helperText={errors.documento?.message}
                />

                <TextField
                  label="Nombres"
                  fullWidth
                  {...register("nombres")}
                  error={!!errors.nombres}
                  helperText={errors.nombres?.message}
                />

                <TextField
                  label="Apellidos"
                  fullWidth
                  {...register("apellidos")}
                  error={!!errors.apellidos}
                  helperText={errors.apellidos?.message}
                />

                <TextField
                  label="Hobbie"
                  fullWidth
                  {...register("hobbie")}
                  error={!!errors.hobbie}
                  helperText={errors.hobbie?.message}
                />
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={handleCloseModal} color="inherit">
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disableElevation
              >
                Guardar
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
