import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Grid, Paper, Box, InputBase, IconButton, Typography, Button, Avatar, Menu, MenuItem } from "@mui/material";
import { Search as SearchIcon, Add as AddIcon, FilterList as FilterIcon, StickyNote2 } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import CardNote from "./CardNote";
import ModalNote from "./ModalNote";

const Notes = ({ collapsed }) => {
  // ============================================================================
  // ESTADOS DEL COMPONENTE
  // ============================================================================
  const [notes, setNotes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [notaEditar, setNotaEditar] = useState(null);
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");

  // ============================================================================
  // DATOS DE USUARIO Y PERFIL
  // ============================================================================
  let user = null;
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  const roleName = user?.role?.role_name || "Rol desconocido";
  const displayName = `${user?.name?.split(" ")[0] || ""} ${user?.last_name?.split(" ")[0] || ""}`.trim();
  const usernameInitials = user?.username?.slice(0, 2).toUpperCase() || "";

  const colorMap = {
  Rojo: "#e74c3c",
  Azul: "#3498db",
  Verde: "#2ecc71",
  Amarillo: "#f1c40f",
  Morado: "#9b59b6",
  Naranja: "#e67e22",
  Rosa: "#e91e63",
  Durazno: "#ffb74d" ,
  Turquesa: "#1abc9c",
  RojoVino: "#880e4f" ,
  Lima:"#cddc39",
  Cian: "#00acc1",
  Lavanda:"#9575cd",
  Magenta: "#d81b60",
  Coral: "#ff7043",
};

const getMappedColor = (colorName) => colorMap[colorName] || "#ff4300";

  // ============================================================================
  // FUNCIONES DE MANEJO
  // ============================================================================
  const abrirModalRegistro = () => {
    setModoEdicion(false);
    setNotaEditar(null);
    setModalAbierto(true);
  };

  const abrirModalEdicion = (nota) => {
    setModoEdicion(true);
    setNotaEditar(nota);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setModoEdicion(false);
    setNotaEditar(null);
    fetchNotes(); // Refrescar las notas al cerrar
  };

  const handleFilterClick = (e) => setAnchorElFilter(e.currentTarget);
  const handleFilterClose = () => setAnchorElFilter(null);

  const handleSort = (criterion) => {
    setSortBy(criterion);
    handleFilterClose();
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  // ============================================================================
  // FUNCIONES DE NOTAS
  // ============================================================================
  const fetchNotes = () => {
    const savedNotes = localStorage.getItem("userNotes");
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(Array.isArray(parsedNotes) ? parsedNotes : []);
      } catch {
        setNotes([]);
      }
    } else {
      setNotes([]);
    }
  };

  const handleSaveNote = (noteData) => {
    if (modoEdicion) {
      // Actualizar nota existente
      const updatedNotes = notes.map((note) => (note.id === noteData.id ? noteData : note));
      setNotes(updatedNotes);
      localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
    } else {
      // Crear nueva nota
      const newNote = {
        ...noteData,
        id: Date.now(),
        createdAt: new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
    }
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
  };

  // ============================================================================
  // FILTRADO Y ORDENAMIENTO
  // ============================================================================
  const filteredNotes = useMemo(() => {
    const list = Array.isArray(notes) ? notes : [];
    const term = searchTerm.toLowerCase();

    let arr = list.filter((note) => {
      return (
        note.title?.toLowerCase().includes(term) ||
        note.content?.toLowerCase().includes(term) ||
        note.category?.toLowerCase().includes(term)
      );
    });

    switch (sortBy) {
      case "title_asc":
        arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "title_desc":
        arr.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
        break;
      case "category":
        arr.sort((a, b) => (a.category || "").localeCompare(b.category || ""));
        break;
      case "date":
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    return arr;
  }, [searchTerm, sortBy, notes]);

  // ============================================================================
  // EFECTOS
  // ============================================================================
  useEffect(() => {
    fetchNotes();
  }, []);

  // ============================================================================
  // RENDERIZADO
  // ============================================================================
  return (
    <Box
      sx={{
        background: "#272829",
        minHeight: "100vh",
        padding: "5px",
        color: "white",
      }}
    >
      {/* ========================================================================
          ENCABEZADO DE LA PÁGINA
          ======================================================================== */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ padding: "10px 0 20px 0" }}>
        <Grid item sx={{ marginRight: "10px" }}>
          <Typography variant="h4" sx={{ fontSize: "30px", fontWeight: "bold" }}>
            Notas
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "16px", color: "#ccc", mt: "10px" }}>
            {roleName === "Administrador" ? "Crea y administra tus notas personales" : "Consulta y gestiona tus notas"}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={5.8}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px 20px",
              borderRadius: "30px",
              boxShadow: 3,
              width: collapsed ? "420px" : "800px",
              maxWidth: "100%",
              height: "48px",
              backgroundColor: "#fff",
              border: "1px solid #444",
            }}
          >
            <IconButton type="submit" sx={{ p: "8px" }} disabled>
              <SearchIcon sx={{ fontSize: "26px", color: "#aaa" }} />
            </IconButton>
            <InputBase
              onChange={handleSearch}
              sx={{ ml: 2, flex: 1, fontSize: "18px", color: "#000" }}
              placeholder="Buscar una nota..."
              value={searchTerm}
            />
          </Paper>
        </Grid>

        <Grid item sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ textAlign: "right", ml: "15px" }}>
            <Typography sx={{ fontSize: "20px", color: "#F8820B", fontWeight: "bold" }}>{displayName}</Typography>
            <Typography variant="body2" sx={{ fontSize: "15px", color: "#ccc" }}>
              {roleName}
            </Typography>
          </Box>
          <IconButton sx={{ color: "#fff" }}>
            {usernameInitials ? (
              <Avatar sx={{ width: 50, height: 50, bgcolor: roleName === "Colaborador" ? getMappedColor(user?.color) : "#ff4300", }}>{usernameInitials}</Avatar>
            ) : (
              <AccountCircle sx={{ width: 50, height: 50, fontSize: 60 }} />
            )}
          </IconButton>
        </Grid>
      </Grid>

      {/* ========================================================================
          BOTONES DE ACCIÓN
          ======================================================================== */}
      <Grid container justifyContent="flex-end" spacing={2} sx={{ mb: 5, marginTop: "15px" }}>
        <Grid item>
          <Button
            sx={{
              backgroundColor: "#F8820B",
              color: "black",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              "&:hover": {
                backgroundColor: "#FF6600",
                color: "white",
              },
            }}
            onClick={abrirModalRegistro}
            startIcon={<AddIcon />}
          >
            AÑADIR NUEVA NOTA
          </Button>
        </Grid>
        <Grid item>
          <Button
            startIcon={<FilterIcon />}
            onClick={handleFilterClick}
            sx={{
              color: "#F8820B",
              fontWeight: "Bold",
              borderRadius: "8px",
              padding: "10px 20px",
              border: "1px solid #F8820B",
              "&:hover": {
                backgroundColor: "#FF6600",
                border: "1px solid #FF6600",
                color: "white",
              },
            }}
          >
            Filtrar
          </Button>
          <Menu anchorEl={anchorElFilter} open={Boolean(anchorElFilter)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleSort("title_asc")}>Título (A-Z)</MenuItem>
            <MenuItem onClick={() => handleSort("title_desc")}>Título (Z-A)</MenuItem>
            <MenuItem onClick={() => handleSort("category")}>Categoría</MenuItem>
            <MenuItem onClick={() => handleSort("date")}>Fecha</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {/* ========================================================================
          CONTENIDO DE NOTAS
          ======================================================================== */}
      {notes.length === 0 ? (
        // ESTADO VACÍO - Cuando no hay notas
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            p: 4,
          }}
        >
          <StickyNote2
            sx={{
              fontSize: 80,
              color: "#ccc",
              mb: 2,
            }}
          />
          <Typography variant="h5" sx={{ color: "#ccc", mb: 2, fontWeight: "bold" }}>
            No existe ningún registro de notas
          </Typography>
          <Typography sx={{ color: "#999", mb: 3 }}>
            Comience creando su primera nota para recordar cosas importante.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#F8820B",
              color: "#000",
              fontWeight: "bold",
              px: 3,
              py: 1.5,
              mt: 1,
              boxShadow: "0 4px 12px rgba(248, 130, 11, 0.4)",
              "&:hover": {
                backgroundColor: "#ff4300",
                color: "white",
                boxShadow: "0 6px 16px rgba(248, 66, 11, 0.68)",
              },
              borderRadius: 2,
            }}
            onClick={abrirModalRegistro}
          >
            Añadir su primera nota
          </Button>
        </Box>
      ) : filteredNotes.length === 0 ? (
        // ESTADO SIN RESULTADOS DE BÚSQUEDA
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            textAlign: "center",
            p: 4,
          }}
        >
          <StickyNote2
            sx={{
              fontSize: 80,
              color: "#ccc",
              mb: 2,
            }}
          />
          <Typography variant="h5" sx={{ color: "#ccc", mb: 2, fontWeight: "bold" }}>
            No se encontraron notas
          </Typography>
          <Typography sx={{ color: "#999", mb: 3 }}>Intenta con otro término de búsqueda</Typography>
        </Box>
      ) : (
        // GRILLA DE NOTAS
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={note.id}>
              <CardNote note={note} onEdit={() => abrirModalEdicion(note)} onDelete={handleDeleteNote} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* ========================================================================
          MODAL DE NOTAS
          ======================================================================== */}
      <ModalNote
        open={modalAbierto}
        onClose={cerrarModal}
        modoEdicion={modoEdicion}
        notaEditar={notaEditar}
        onGuardadoExitoso={handleSaveNote}
      />
    </Box>
  );
};

Notes.propTypes = {
  collapsed: PropTypes.bool,
};

Notes.defaultProps = {
  collapsed: false,
};

export default Notes;
