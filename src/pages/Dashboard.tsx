import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Edit, Delete, Add, ExitToApp } from "@mui/icons-material";
import type { Persona } from "../types/index";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import axiosClient from '../api/axiosClient';.

//Dummys
const initialData: Persona[] = [
  {
    id: 1,
    tipoDocumento: "CC",
    documento: "123456789",
    nombres: "Pepito",
    apellidos: "Pérez",
    hobbie: "Programar",
  },
  {
    id: 2,
    tipoDocumento: "TI",
    documento: "987654321",
    nombres: "Ana",
    apellidos: "Gómez",
    hobbie: "Leer",
  },
];

const Dashboard = () => {
  const [personas, setPersonas] = useState<Persona[]>(initialData);
  const [open, setOpen] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona>({
    tipoDocumento: "",
    documento: "",
    nombres: "",
    apellidos: "",
    hobbie: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchPersonas();
  // }, []);

  // const fetchPersonas = async () => {
  //   try {
  //     const res = await axiosClient.get('/personas');
  //     setPersonas(res.data);
  //   } catch (error) {
  //     enqueueSnackbar('Error cargando datos', { variant: 'error' });
  //   }
  // };

  const handleSave = () => {
    if (isEdit) {
      setPersonas(
        personas.map((p) => (p.id === currentPersona.id ? currentPersona : p))
      );
      enqueueSnackbar("Persona actualizada correctamente", {
        variant: "success",
      }); //
    } else {
      setPersonas([...personas, { ...currentPersona, id: Date.now() }]);
      enqueueSnackbar("Persona creada correctamente", { variant: "success" }); //
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar?")) {
      setPersonas(personas.filter((p) => p.id !== id));
      enqueueSnackbar("Persona eliminada", { variant: "warning" });
    }
  };

  const openModal = (persona?: Persona) => {
    if (persona) {
      setCurrentPersona(persona);
      setIsEdit(true);
    } else {
      setCurrentPersona({
        tipoDocumento: "",
        documento: "",
        nombres: "",
        apellidos: "",
        hobbie: "",
      });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Box
      sx={{ flex: 1, bgcolor: "#f5f5f5", minHeight: "100vh", width: "100%" }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h5" color="primary">
              Listado de Personal
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => openModal()}
            >
              Agregar Persona
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#eeeeee" }}>
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
                {personas.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.tipoDocumento}</TableCell>
                    <TableCell>{row.documento}</TableCell>
                    <TableCell>{row.nombres}</TableCell>
                    <TableCell>{row.apellidos}</TableCell>
                    <TableCell>{row.hobbie}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => openModal(row)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id!)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Modal de Formulario */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {isEdit ? "Editar Persona" : "Nueva Persona"}
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              select
              label="Tipo Documento"
              fullWidth
              margin="dense"
              value={currentPersona.tipoDocumento}
              onChange={(e) =>
                setCurrentPersona({
                  ...currentPersona,
                  tipoDocumento: e.target.value,
                })
              }
            >
              <MenuItem value="CC">Cédula de Ciudadanía</MenuItem>
              <MenuItem value="TI">Tarjeta de Identidad</MenuItem>
              <MenuItem value="CE">Cédula de Extranjería</MenuItem>
            </TextField>
            <TextField
              label="Documento"
              fullWidth
              margin="dense"
              value={currentPersona.documento}
              onChange={(e) =>
                setCurrentPersona({
                  ...currentPersona,
                  documento: e.target.value,
                })
              }
            />
            <TextField
              label="Nombres"
              fullWidth
              margin="dense"
              value={currentPersona.nombres}
              onChange={(e) =>
                setCurrentPersona({
                  ...currentPersona,
                  nombres: e.target.value,
                })
              }
            />
            <TextField
              label="Apellidos"
              fullWidth
              margin="dense"
              value={currentPersona.apellidos}
              onChange={(e) =>
                setCurrentPersona({
                  ...currentPersona,
                  apellidos: e.target.value,
                })
              }
            />
            <TextField
              label="Hobbie"
              fullWidth
              margin="dense"
              value={currentPersona.hobbie}
              onChange={(e) =>
                setCurrentPersona({ ...currentPersona, hobbie: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;
