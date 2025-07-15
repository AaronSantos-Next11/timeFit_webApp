import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Delete, 
  Save, 
  Cancel,
  StickyNote2
} from '@mui/icons-material';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newNote, setNewNote] = useState({ title: '', content: '', category: 'Curso' });
  const [editNote, setEditNote] = useState({ title: '', content: '', category: 'Curso' });

  // Colores para las categorías
  const categoryColors = {
    'Curso': '#e91e63',
    'Reporte': '#F8820B',
    'Soporte': '#f44336',
    'Recordatorio': '#00bcd4',
    'Productos': '#4caf50',
    'Agradecimiento': '#ff9800',
    'Nuevo': '#9c27b0'
  };

  // Cargar notas desde localStorage al iniciar
  useEffect(() => {
    const savedNotes = localStorage.getItem('userNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Guardar notas en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('userNotes', JSON.stringify(notes));
  }, [notes]);

  // Agregar nueva nota
  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
        category: newNote.category,
        createdAt: new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };
      setNotes([note, ...notes]);
      setNewNote({ title: '', content: '', category: 'Curso' });
      setIsAddingNote(false);
    }
  };

  // Editar nota
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditNote({ title: note.title, content: note.content, category: note.category });
  };

  // Guardar cambios de edición
  const handleSaveEdit = () => {
    if (editNote.title.trim() && editNote.content.trim()) {
      setNotes(notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, title: editNote.title, content: editNote.content, category: editNote.category }
          : note
      ));
      setEditingNoteId(null);
      setEditNote({ title: '', content: '', category: 'Curso' });
    }
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditNote({ title: '', content: '', category: 'Curso' });
  };

  // Eliminar nota
  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div style={{ 
      background: '#272829', 
      minHeight: '100vh', 
      padding: '20px',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ 
          color: 'white', 
          margin: 0,
          fontSize: '24px',
          fontWeight: 'normal'
        }}>
          Notas
        </h1>
        <button
          onClick={() => setIsAddingNote(true)}
          style={{
            background: '#F8820B',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#e6740a'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#F8820B'}
        >
          Añadir nueva nota
        </button>
      </div>

      {/* Formulario para agregar nueva nota */}
      {isAddingNote && (
        <div style={{
          background: '#3a3a3a',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #F8820B'
        }}>
          <h3 style={{ color: '#F8820B', marginBottom: '15px' }}>Nueva Nota</h3>
          <input
            type="text"
            placeholder="Título de la nota..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              background: '#45474B',
              color: 'white',
              border: '1px solid #666',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <textarea
            placeholder="Contenido de la nota..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              background: '#45474B',
              color: 'white',
              border: '1px solid #666',
              borderRadius: '8px',
              fontSize: '14px',
              minHeight: '80px',
              resize: 'vertical',
              outline: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <select
            value={newNote.category}
            onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              background: '#45474B',
              color: 'white',
              border: '1px solid #666',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="Curso">Curso</option>
            <option value="Reporte">Reporte</option>
            <option value="Soporte">Soporte</option>
            <option value="Recordatorio">Recordatorio</option>
            <option value="Productos">Productos</option>
            <option value="Agradecimiento">Agradecimiento</option>
            <option value="Nuevo">Nuevo</option>
          </select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddNote}
              style={{
                background: '#F8820B',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px'
              }}
            >
              <Save fontSize="small" /> Guardar
            </button>
            <button
              onClick={() => {
                setIsAddingNote(false);
                setNewNote({ title: '', content: '', category: 'Curso' });
              }}
              style={{
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '10px 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px'
              }}
            >
              <Cancel fontSize="small" /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de notas */}
      {notes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <StickyNote2 style={{ fontSize: '80px', marginBottom: '20px' }} />
          <h3 style={{ marginBottom: '10px' }}>No tienes notas aún</h3>
          <p>Haz clic en "Añadir nueva nota" para crear tu primera nota</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          padding: '0'
        }}>
          {notes.map(note => (
            <div key={note.id} style={{
              background: categoryColors[note.category] || '#F8820B',
              borderRadius: '12px',
              padding: '20px',
              color: 'white',
              position: 'relative',
              minHeight: '180px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              {editingNoteId === note.id ? (
                // Modo edición
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <input
                    type="text"
                    value={editNote.title}
                    onChange={(e) => setEditNote({ ...editNote, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '10px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <textarea
                    value={editNote.content}
                    onChange={(e) => setEditNote({ ...editNote, content: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '10px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '60px',
                      resize: 'vertical',
                      outline: 'none',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      flex: 1
                    }}
                  />
                  <select
                    value={editNote.category}
                    onChange={(e) => setEditNote({ ...editNote, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      marginBottom: '15px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="Curso" style={{ color: 'black' }}>Curso</option>
                    <option value="Reporte" style={{ color: 'black' }}>Reporte</option>
                    <option value="Soporte" style={{ color: 'black' }}>Soporte</option>
                    <option value="Recordatorio" style={{ color: 'black' }}>Recordatorio</option>
                    <option value="Productos" style={{ color: 'black' }}>Productos</option>
                    <option value="Agradecimiento" style={{ color: 'black' }}>Agradecimiento</option>
                    <option value="Nuevo" style={{ color: 'black' }}>Nuevo</option>
                  </select>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleSaveEdit}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Save fontSize="small" /> Guardar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '12px'
                      }}
                    >
                      <Cancel fontSize="small" /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                // Modo visualización
                <>
                  {/* Botón de editar en la esquina superior derecha */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '5px'
                  }}>
                    <button
                      onClick={() => handleEditNote(note)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
                      <Edit fontSize="small" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px'
                      }}
                    >
                      <Delete fontSize="small" />
                    </button>
                  </div>

                  {/* Contenido de la nota */}
                  <div style={{ paddingRight: '60px' }}>
                    <h3 style={{
                      color: 'white',
                      margin: '0 0 10px 0',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {note.title}
                    </h3>
                    <p style={{
                      color: 'white',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      margin: '0 0 15px 0',
                      opacity: 0.9
                    }}>
                      {note.content}
                    </p>
                  </div>

                  {/* Botón de categoría en la parte inferior */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto'
                  }}>
                    <button
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '6px 16px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'default'
                      }}
                    >
                      {note.category}
                    </button>
                    <span style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      {note.createdAt}
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

