import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import InventoryIcon from '@mui/icons-material/Inventory';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const CardNote = ({ note, onEdit, onDelete }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(note.id);
    setOpenDeleteDialog(false);
  };

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Configuración de categorías con fondos con gradiente sutil mejorado
  const getCategoryConfig = (category) => {
    const configs = {
      'nota': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#e67d22ff',
        textColor: '#ffffff',
        icon: StickyNote2Icon,
      },
      'recordatorio': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#d81b60',
        textColor: '#ffffff',
        icon: NotificationImportantIcon,
      },
      'reporte': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#f1c40fcb',
        textColor: '#ffffff',
        icon: AssessmentIcon,
      },
      'curso': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#8873acff',
        textColor: '#ffffff',
        icon: SchoolIcon,
      },
      'capacitacion': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#2c84beff',
        textColor: '#ffffff',
        icon: ModelTrainingIcon,
      },
      'productos': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#5adc39a4',
        textColor: '#ffffff',
        icon: InventoryIcon,
      },
      'soporte': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#15a084ff',
        textColor: '#ffffff',
        icon: SupportAgentIcon,
      },
      'quejas': { 
        color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
        borderColor: '#e74c3c',
        textColor: '#ffffff',
        icon: ReportProblemIcon,
      }
    };
    return configs[category?.toLowerCase()] || {
      color: 'linear-gradient(135deg, #404040 0%, #353535 100%)', 
      borderColor: '#1abc9c',
      textColor: '#ffffff',
      icon: CategoryIcon,
    };
  };

  const categoryConfig = getCategoryConfig(note.category);
  const CategoryIconComponent = categoryConfig.icon;

  return (
    <>
      <Card
        sx={{
          width: '100%',
          minHeight: 320,
          maxHeight: 420,
          backgroundColor: categoryConfig.color,
          backgroundImage: categoryConfig.color,
          borderLeft: `8px solid ${categoryConfig.borderColor}`,
          borderRadius: '8px',
          position: 'relative',
          overflow: 'visible',
          cursor: 'pointer',
          boxShadow: `
            0 4px 20px rgba(0,0,0,0.25),
            0 2px 8px rgba(0,0,0,0.15),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `,
          transform: 'rotate(-0.5deg)',
          transformOrigin: 'center center',
          '&:nth-of-type(even)': {
            transform: 'rotate(0.5deg)',
          },
          '&:nth-of-type(3n)': {
            transform: 'rotate(-0.3deg)',
          },
          '&:hover': {
            transform: 'rotate(0deg) translateY(-4px) scale(1.02)',
            boxShadow: `
              0 12px 40px rgba(0,0,0,0.35),
              0 6px 20px rgba(0,0,0,0.25),
              inset 0 1px 0 rgba(255,255,255,0.15)
            `,
            zIndex: 10,
          },
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Cinta adhesiva superior */}
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%) rotate(1deg)',
            width: 80,
            height: 24,
            background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
            borderRadius: '4px',
            boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
            zIndex: 2,
            border: '1px solid rgba(0,0,0,0.1)',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70%',
              height: '2px',
              background: 'rgba(0,0,0,0.1)',
              borderRadius: '1px',
            }
          }}
        />

        {/* Header con icono y título */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: categoryConfig.borderColor,
              color: '#fff',
              boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
              flexShrink: 0,
            }}
          >
          <CategoryIconComponent sx={{ fontSize: 20 }} />
          </Avatar>
          
          <Box sx={{ flex: 1, pr: 10 }}>
            <Typography
              variant="h6"
              sx={{
                color: categoryConfig.textColor,
                fontWeight: 700,
                fontSize: '1rem',
                lineHeight: 1.3,
                minHeight: '40px',
                maxHeight: '50px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                fontFamily: '"Inter", "Roboto", sans-serif',
                overflowWrap: 'break-word', // This ensures long words are broken
              }}
            >
              {note.title || 'Sin título'}
            </Typography>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 0.6,
              zIndex: 3
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              sx={{
                bgcolor: 'rgba(0,0,0,0.4)',
                color: categoryConfig.borderColor,
                width: 40,
                height: 40,
                boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
                border: `2px solid ${categoryConfig.borderColor}30`,
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: categoryConfig.borderColor,
                  color: '#fff',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteClick();
              }}
              sx={{
                bgcolor: 'rgba(0,0,0,0.4)',
                color: '#e74c3c',
                width: 40,
                height: 40,
                boxShadow: '0 3px 12px rgba(0,0,0,0.25)',
                border: '2px solid rgba(231, 76, 60, 0.4)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  bgcolor: '#e74c3c',
                  color: '#fff',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <DeleteIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 3, pt: 0 }}>
          {/* Contenido */}
          <Typography
            variant="body1"
            sx={{
              color: categoryConfig.textColor,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: 3,
              minHeight: '100px',
              maxHeight: '120px',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 6,
              WebkitBoxOrient: 'vertical',
              wordBreak: 'break-word',
              whiteSpace: 'pre-wrap',
              fontFamily: '"Inter", "Roboto", sans-serif',
              fontWeight: 400,
            }}
          >
            {note.content || 'Sin contenido'}
          </Typography>

          <Divider sx={{ 
            borderColor: `${categoryConfig.borderColor}40`,
            mb: 2.5,
            opacity: 0.7
          }} />

          {/* Footer */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              gap: 1,
            }}
          >
            {/* Categoría */}
            <Chip
              label={note.category || 'Sin categoría'}
              size="small"
              sx={{
                backgroundColor: categoryConfig.borderColor,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.7rem',
                height: '28px',
                fontFamily: '"Inter", "Roboto", sans-serif',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                '& .MuiChip-label': {
                  px: 2,
                },
              }}
            />

            {/* Fecha */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: 'rgba(0,0,0,0.3)',
              px: 1.5,
              py: 1.2,
              borderRadius: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              border: `2px solid ${categoryConfig.borderColor}40`,
              backdropFilter: 'blur(8px)',
            }}>
              <CalendarTodayIcon 
                sx={{ 
                  color: categoryConfig.borderColor, 
                  fontSize: 16 
                }} 
              />
              <Typography
                variant="caption"
                sx={{
                  color: categoryConfig.textColor,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  fontFamily: '"Inter", "Roboto", sans-serif',
                }}
              >
                {note.createdAt || 'Sin fecha'}
              </Typography>
            </Box>
          </Box>
        </CardContent>

        {/* Líneas sutiles de papel */}
        <Box
          sx={{
            position: 'absolute',
            top: 120,
            left: 24,
            right: 24,
            bottom: 80,
            background: `repeating-linear-gradient(
              transparent,
              transparent 23px,
              ${categoryConfig.borderColor}20 23px,
              ${categoryConfig.borderColor}20 24px
            )`,
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />
      </Card>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            backgroundColor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
          },
        }}
      >
        <DialogTitle 
        sx={{ color: "#F8820B", fontWeight: "bold" }}
        >
          ¿Eliminar nota?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#ccc', mb: 1, fontFamily: '"Inter", "Roboto", sans-serif' }}>
            ¿Estás seguro de que deseas eliminar esta nota?
          </Typography>
          <Typography sx={{ 
            color: '#999', 
            fontSize: '0.8rem',
            mt: 1,
            fontFamily: '"Inter", "Roboto", sans-serif'
          }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#ccc",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{
              boxShadow: "0 4px 12px rgba(231, 76, 60, 0.4)",
              "&:hover": { boxShadow: "0 6px 16px rgba(231, 76, 60, 0.6)" },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CardNote.propTypes = {
  note: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CardNote;
