import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL;

const ModalVenta = ({ open, onClose, modoEdicion, ventaEditar, onGuardadoExitoso }) => {
  const [form, setForm] = useState({
    product_id: "",
    quantity_sold: "", // Cambiado a string vacío para mejor manejo
    sale_code: "",
    sale_price: 0,
    client_id: "",
    client_name: "",
    seller_id: "",
    seller_name: "",
    sale_status: "Exitosa",
  });

  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  // Obtener token del usuario - CORREGIDO
  const getAuthToken = () => {
    try {
      // Primero intentar con el token directo (como en CardProduct)
      const directToken = localStorage.getItem("token");
      if (directToken) {
        return directToken;
      }

      // Si no existe, intentar con el objeto user
      const userFromLocal = localStorage.getItem("user");
      const userFromSession = sessionStorage.getItem("user");

      if (userFromLocal) {
        const user = JSON.parse(userFromLocal);
        return user?.token;
      }

      if (userFromSession) {
        const user = JSON.parse(userFromSession);
        return user?.token;
      }

      return null;
    } catch (error) {
      console.error("Error obteniendo token:", error);
      return null;
    }
  };

  // Obtener información del usuario actual - CORREGIDO
  const getCurrentUser = () => {
    try {
      const userFromLocal = localStorage.getItem("user");
      const userFromSession = sessionStorage.getItem("user");

      if (userFromLocal) {
        return JSON.parse(userFromLocal);
      }

      if (userFromSession) {
        return JSON.parse(userFromSession);
      }

      return null;
    } catch (error) {
      console.error("Error obteniendo usuario:", error);
      return null;
    }
  };

  // Generar código de venta único profesional
  const generateSaleCode = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    
    return `PS-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
  };

  // Función para hacer peticiones con manejo de errores mejorado - CORREGIDO
  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No hay sesión activa. Por favor, inicia sesión nuevamente.");
    }

    console.log("Haciendo petición a:", url);
    console.log("Token encontrado:", token ? "✓" : "✗");

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log("Respuesta status:", response.status);

    if (!response.ok) {
      let errorMessage = `Error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        console.log(e);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }, []);

  // Cargar productos y clientes - CORREGIDO
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setErrors({});

    try {
      console.log("Iniciando carga de datos...");
      console.log("API URL:", API_BASE_URL);

      // Cargar productos y clientes en paralelo
      const [productosData, clientesData] = await Promise.all([
        makeAuthenticatedRequest(`${API_BASE_URL}/api/products/all`),
        makeAuthenticatedRequest(`${API_BASE_URL}/api/clients/all`),
      ]);

      console.log("Datos productos recibidos:", productosData);
      console.log("Datos clientes recibidos:", clientesData);

      // Procesar productos
      let productsArray = [];
      if (productosData) {
        if (Array.isArray(productosData)) {
          productsArray = productosData;
        } else if (productosData.products && Array.isArray(productosData.products)) {
          productsArray = productosData.products;
        } else if (productosData.data && Array.isArray(productosData.data)) {
          productsArray = productosData.data;
        }
      }

      // Procesar clientes
      let clientsArray = [];
      if (clientesData) {
        if (Array.isArray(clientesData)) {
          clientsArray = clientesData;
        } else if (clientesData.clients && Array.isArray(clientesData.clients)) {
          clientsArray = clientesData.clients;
        } else if (clientesData.data && Array.isArray(clientesData.data)) {
          clientsArray = clientesData.data;
        }
      }

      console.log("Productos procesados:", productsArray);
      console.log("Clientes procesados:", clientsArray);

      setProductos(productsArray);
      setClientes(clientsArray);

      // Verificar si se cargaron datos
      if (productsArray.length === 0 && clientsArray.length === 0) {
        setErrors({
          general: "No se encontraron productos ni clientes registrados en este gimnasio.",
        });
      } else if (productsArray.length === 0) {
        setErrors({
          general: "No se encontraron productos registrados en este gimnasio.",
        });
      } else if (clientsArray.length === 0) {
        setErrors({
          general: "No se encontraron clientes registrados en este gimnasio.",
        });
      }
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setErrors({
        general: err.message || "Error al cargar los datos necesarios. Verifica tu conexión.",
      });
      setProductos([]);
      setClientes([]);
    } finally {
      setLoadingData(false);
    }
  }, [makeAuthenticatedRequest]);

  // Función para calcular el precio total
  const calculateTotalPrice = useCallback((quantity, product) => {
    if (!product || !quantity || quantity <= 0) return 0;
    const unitPrice = getProductPrice(product);
    return unitPrice * quantity;
  }, []);

  // Efecto principal para inicializar el modal
  useEffect(() => {
    if (open) {
      fetchData();

      if (modoEdicion && ventaEditar) {
        // Modo edición - solo lectura de detalles
        setForm({
          product_id: ventaEditar.product_id || "",
          quantity_sold: ventaEditar.quantity_sold || "",
          sale_code: ventaEditar.sale_code || "",
          sale_price: ventaEditar.total_sale || 0,
          client_id: ventaEditar.client_id || "",
          client_name: ventaEditar.client_name || "",
          seller_id: ventaEditar.seller_id || "",
          seller_name: ventaEditar.seller_name || "",
          sale_status: ventaEditar.sale_status || "Exitosa",
        });
      } else {
        // Modo registro - formulario limpio
        const user = getCurrentUser();
        const displayName =
          user && user.name && user.last_name
            ? `${user.name.split(" ")[0]} ${user.last_name.split(" ")[0]}`
            : user?.username || user?.name || "Usuario";

        setForm({
          product_id: "",
          quantity_sold: "", // String vacío para permitir al usuario escribir
          sale_code: generateSaleCode(),
          sale_price: 0,
          client_id: "",
          client_name: "",
          seller_id: user?._id || user?.id || "",
          seller_name: displayName,
          sale_status: "Exitosa",
        });
        setSelectedProduct(null);
        setSelectedClient(null);
      }
      setErrors({});
    }
  }, [open, modoEdicion, ventaEditar, fetchData]);

  // Efecto para establecer producto y cliente seleccionados en modo edición
  useEffect(() => {
    if (modoEdicion && ventaEditar && productos.length > 0 && clientes.length > 0) {
      // Buscar y establecer el producto seleccionado
      const producto = productos.find((p) => (p._id || p.id) === ventaEditar.product_id);
      if (producto) {
        setSelectedProduct(producto);
      }

      // Buscar y establecer el cliente seleccionado
      const cliente = clientes.find((c) => (c._id || c.id) === ventaEditar.client_id);
      if (cliente) {
        setSelectedClient(cliente);
      }
    }
  }, [modoEdicion, ventaEditar, productos, clientes]);

  // Función para obtener el nombre completo del cliente
  const getClientFullName = (client) => {
    if (!client) return "Cliente sin nombre";

    // Manejar diferentes estructuras de nombre
    if (client.full_name) {
      const { first = "", last_father = "", last_mother = "" } = client.full_name;
      return `${first} ${last_father} ${last_mother}`.trim() || "Cliente sin nombre";
    }

    // Fallback si no tiene full_name
    if (client.name) return client.name;
    if (client.first_name) {
      return `${client.first_name} ${client.last_name || ""}`.trim();
    }

    return "Cliente sin nombre";
  };

  // Obtener nombre del producto
  const getProductName = (product) => {
    return product?.name_product || product?.name || "Producto sin nombre";
  };

  // Obtener código del producto
  const getProductCode = (product) => {
    return product?.code_product || product?.barcode || "Sin código";
  };

  // Obtener precio del producto
  const getProductPrice = (product) => {
    if (product?.price?.amount) return product.price.amount;
    if (product?.price) return product.price;
    return 0;
  };

  // Obtener stock del producto
  const getProductStock = (product) => {
    if (product?.stock?.quantity !== undefined) return product.stock.quantity;
    if (product?.stock !== undefined) return product.stock;
    return 0;
  };

  // Manejar cambio de producto
  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
    if (newValue) {
      // Calcular precio total basado en la cantidad actual
      const currentQuantity = parseInt(form.quantity_sold) || 0;
      const totalPrice = calculateTotalPrice(currentQuantity, newValue);
      setForm((prev) => ({
        ...prev,
        product_id: newValue._id || newValue.id,
        sale_price: totalPrice,
      }));
      
      // Limpiar errores relacionados con cantidad si existe el producto
      if (errors.quantity_sold) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.quantity_sold;
          return newErrors;
        });
      }
    } else {
      setForm((prev) => ({
        ...prev,
        product_id: "",
        sale_price: 0,
      }));
    }
  };

  // Manejar cambio de cliente
  const handleClientChange = (event, newValue) => {
    setSelectedClient(newValue);
    if (newValue) {
      setForm((prev) => ({
        ...prev,
        client_id: newValue._id || newValue.id,
        client_name: getClientFullName(newValue),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        client_id: "",
        client_name: "",
      }));
    }
  };

  // Manejar cambios en cantidad - COMPLETAMENTE CORREGIDO
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    // Permitir campo vacío para que el usuario pueda borrar y escribir
    if (value === "") {
      setForm((prev) => ({
        ...prev,
        quantity_sold: "",
        sale_price: 0,
      }));
      
      // Limpiar errores de cantidad
      if (errors.quantity_sold) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.quantity_sold;
          return newErrors;
        });
      }
      return;
    }

    // Validar que solo contenga números
    if (!/^\d+$/.test(value)) {
      return; // No actualizar si no es un número válido
    }

    const quantity = parseInt(value);
    
    // Validar que sea un número válido y mayor a 0
    if (isNaN(quantity) || quantity < 1) {
      setForm((prev) => ({
        ...prev,
        quantity_sold: value, // Mantener el valor que está escribiendo el usuario
        sale_price: 0,
      }));
      
      setErrors(prev => ({
        ...prev,
        quantity_sold: "La cantidad debe ser mayor a 0"
      }));
      return;
    }

    // Validar stock disponible si hay producto seleccionado
    if (selectedProduct) {
      const stockDisponible = getProductStock(selectedProduct);
      if (quantity > stockDisponible) {
        setForm((prev) => ({
          ...prev,
          quantity_sold: value, // Mantener el valor que está escribiendo el usuario
          sale_price: 0,
        }));
        
        setErrors(prev => ({
          ...prev,
          quantity_sold: `Stock insuficiente. Disponible: ${stockDisponible}`
        }));
        return;
      }
    }

    // Si llegamos aquí, la cantidad es válida
    // Limpiar errores
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.quantity_sold;
      return newErrors;
    });

    // Calcular precio total
    const totalPrice = selectedProduct ? calculateTotalPrice(quantity, selectedProduct) : 0;
    
    setForm((prev) => ({
      ...prev,
      quantity_sold: value, // Usar el valor string tal como lo escribió el usuario
      sale_price: totalPrice,
    }));
  };

  // Manejar cambios generales en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validación del formulario
  const validate = () => {
    const newErrors = {};

    if (!form.product_id) newErrors.product_id = "Producto requerido";
    if (!form.client_id && !form.client_name) newErrors.client = "Cliente requerido";
    
    const quantity = parseInt(form.quantity_sold);
    if (!form.quantity_sold || isNaN(quantity) || quantity <= 0) {
      newErrors.quantity_sold = "Cantidad debe ser mayor a 0";
    }
    
    if (!form.sale_code) newErrors.sale_code = "Código de venta requerido";
    if (!form.sale_status) newErrors.sale_status = "Estado de venta requerido";

    // Verificar stock disponible
    if (selectedProduct && quantity > getProductStock(selectedProduct)) {
      newErrors.quantity_sold = `Stock insuficiente. Disponible: ${getProductStock(selectedProduct)}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Guardar venta
  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Convertir quantity_sold a número antes de enviar
      const formToSend = {
        ...form,
        quantity_sold: parseInt(form.quantity_sold)
      };

      const data = await makeAuthenticatedRequest(`${API_BASE_URL}/api/products_sales/sell`, {
        method: "POST",
        body: JSON.stringify(formToSend),
      });

      // Mostrar mensaje de éxito
      alert(data.message || "Venta registrada exitosamente");

      // Callback de éxito
      onGuardadoExitoso();
    } catch (error) {
      console.error("Error al guardar venta:", error);
      setErrors({ general: error.message || "Error al procesar la venta" });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const readonly = modoEdicion;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          borderRadius: "16px",
          border: "1px solid #333",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
          color: "#fff",
          p: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: "#FF6600",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            position: "relative",
          }}
        >
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              color: "rgba(14, 14, 14, 1)",
              width: 48,
              height: 48,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {modoEdicion ? <ReceiptIcon /> : <ShoppingCartIcon />}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "black" }}>
              {modoEdicion ? "Detalles de Venta" : "Realizar Venta"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(3, 3, 3, 0.8)", fontWeight: "bold" }}>
              {modoEdicion ? "Información de la venta" : "Completa los datos para procesar la venta"}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          bgcolor: "#1a1a1a",
          color: "#fff",
          p: 3,
          maxHeight: "calc(90vh - 200px)",
          overflowY: "auto",
        }}
      >
        {loadingData ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 4 }}>
            <CircularProgress sx={{ color: "#F8820B" }} />
            <Typography sx={{ ml: 2, color: "#fff" }}>Cargando datos...</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Error general */}
            {errors.general && (
              <Grid item xs={12}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {errors.general}
                </Alert>
              </Grid>
            )}

            {/* Información del producto */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#2a2a2a",
                  borderRadius: "12px",
                  border: "1px solid #333",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <InventoryIcon sx={{ color: "#F8820B" }} />
                  <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                    Información del Producto
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Producto</Typography>
                    {readonly ? (
                      <TextField
                        fullWidth
                        value={ventaEditar?.product_name || ""}
                        disabled
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#f5f5f5",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#e0e0e0" },
                          },
                          "& .MuiInputBase-input": { color: "#666" },
                        }}
                      />
                    ) : (
                      <Autocomplete
                        options={productos}
                        getOptionLabel={(option) => getProductName(option)}
                        value={selectedProduct}
                        onChange={handleProductChange}
                        ListboxProps={{
                          style: {
                            maxHeight: "200px",
                          },
                        }}
                        slotProps={{
                          listbox: {
                            style: {
                              maxHeight: "200px",
                              overflow: "auto",
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Selecciona un producto"
                            error={!!errors.product_id}
                            helperText={errors.product_id}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "#fff",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e0e0e0" },
                                "&:hover fieldset": { borderColor: "#F8820B" },
                                "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ 
                              display: "flex", 
                              justifyContent: "space-between", 
                              alignItems: "center", 
                              py: 1.5,
                              px: 2,
                              "&:hover": {
                                bgcolor: "#f5f5f5",
                              }
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
                                {getProductName(option)}
                              </Typography>
                              <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                                Precio: {formatCurrency(getProductPrice(option))}
                              </Typography>
                            </Box>
                            <Chip
                              size="small"
                              label={`Stock: ${getProductStock(option)}`}
                              sx={{
                                bgcolor: getProductStock(option) > 10 
                                  ? "#4caf50" 
                                  : getProductStock(option) > 0 
                                  ? "#ff9800" 
                                  : "#f44336",
                                color: "#fff",
                                fontWeight: "600",
                                minWidth: "80px"
                              }}
                            />
                          </Box>
                        )}
                        noOptionsText="No se encontraron productos"
                        loadingText="Cargando productos..."
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Cantidad</Typography>
                    <TextField
                      fullWidth
                      type="text"
                      name="quantity_sold"
                      value={form.quantity_sold}
                      onChange={handleQuantityChange}
                      disabled={readonly}
                      error={!!errors.quantity_sold}
                      helperText={errors.quantity_sold}
                      placeholder="Ingresa la cantidad"
                      inputProps={{ 
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: readonly ? "#f5f5f5" : "#fff",
                          borderRadius: "8px",
                          "& fieldset": { borderColor: "#e0e0e0" },
                          "&:hover fieldset": { borderColor: "#F8820B" },
                          "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                        },
                        "& .MuiInputBase-input": { color: readonly ? "#666" : "#000" },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Precio Total</Typography>
                    <TextField
                      fullWidth
                      value={formatCurrency(form.sale_price)}
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f5f5f5",
                          borderRadius: "8px",
                          "& fieldset": { borderColor: "#e0e0e0" },
                        },
                        "& .MuiInputBase-input": { color: "#2ecc71", fontWeight: "bold" },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Mostrar información del producto seleccionado */}
                {selectedProduct && !readonly && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: "#1a1a1a", borderRadius: "8px", border: "1px solid #444" }}>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      <strong>Producto:</strong> {getProductName(selectedProduct)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      <strong>Código:</strong> {getProductCode(selectedProduct)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc", mb: 1 }}>
                      <strong>Precio unitario:</strong> {formatCurrency(getProductPrice(selectedProduct))}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ccc" }}>
                      <strong>Stock disponible:</strong> {getProductStock(selectedProduct)} unidades
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Información del cliente */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#2a2a2a",
                  borderRadius: "12px",
                  border: "1px solid #333",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <PersonIcon sx={{ color: "#F8820B" }} />
                  <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                    Información del Cliente y Vendedor
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Cliente *</Typography>
                    {readonly ? (
                      <TextField
                        fullWidth
                        value={form.client_name}
                        disabled
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            bgcolor: "#f5f5f5",
                            borderRadius: "8px",
                            "& fieldset": { borderColor: "#e0e0e0" },
                          },
                          "& .MuiInputBase-input": { color: "#666" },
                        }}
                      />
                    ) : (
                      <Autocomplete
                        options={clientes}
                        getOptionLabel={(option) => getClientFullName(option)}
                        value={selectedClient}
                        onChange={handleClientChange}
                        ListboxProps={{
                          style: {
                            maxHeight: "200px",
                          },
                        }}
                        slotProps={{
                          listbox: {
                            style: {
                              maxHeight: "200px",
                              overflow: "auto",
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Selecciona un cliente"
                            error={!!errors.client}
                            helperText={errors.client}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                bgcolor: "#fff",
                                borderRadius: "8px",
                                "& fieldset": { borderColor: "#e0e0e0" },
                                "&:hover fieldset": { borderColor: "#F8820B" },
                                "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                              },
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            {...props}
                            sx={{ 
                              py: 1.5,
                              px: 2,
                              "&:hover": {
                                bgcolor: "#f5f5f5",
                              }
                            }}
                          >
                            <Typography variant="body1" sx={{ fontWeight: 600, color: "#333" }}>
                              {getClientFullName(option)}
                            </Typography>
                          </Box>
                        )}
                        noOptionsText="No se encontraron clientes"
                        loadingText="Cargando clientes..."
                      />
                    )}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Vendedor</Typography>
                    <TextField
                      fullWidth
                      value={form.seller_name}
                      disabled
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: "#f5f5f5",
                          color: "#3f3c3cff",
                          borderRadius: "8px",
                          "& fieldset": { borderColor: "#3f3c3cff" },
                        },
                        "& .MuiInputBase-input": { color: "#3f3c3cff" },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Typography sx={{ color: "#F8820B", fontWeight: "600", mb: 1 }}>Código de Venta</Typography>
                    <TextField
                      fullWidth
                      name="sale_code"
                      value={form.sale_code}
                      onChange={handleChange}
                      disabled={readonly}
                      error={!!errors.sale_code}
                      helperText={errors.sale_code}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          bgcolor: readonly ? "#f5f5f5" : "#fff",
                          borderRadius: "8px",
                          "& fieldset": { borderColor: "#e0e0e0" },
                          "&:hover fieldset": { borderColor: "#F8820B" },
                          "&.Mui-focused fieldset": { borderColor: "#F8820B" },
                        },
                        "& .MuiInputBase-input": { color: readonly ? "#666" : "#000" },
                      }}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Información adicional en modo edición */}
            {readonly && ventaEditar && (
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#2a2a2a",
                    borderRadius: "12px",
                    border: "1px solid #333",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <ReceiptIcon sx={{ color: "#F8820B" }} />
                    <Typography variant="h6" sx={{ color: "#F8820B", fontWeight: "bold" }}>
                      Detalles de la Venta
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: "#F8820B", fontWeight: "600" }}>
                          Estado de la Venta:
                        </Typography>
                        <Chip
                          label={ventaEditar.sale_status}
                          sx={{
                            backgroundColor:
                              ventaEditar.sale_status === "Exitosa"
                                ? "#4CAF50"
                                : ventaEditar.sale_status === "Pendiente"
                                ? "#FF9800"
                                : "#F44336",
                            color: "#fff",
                            fontWeight: "600",
                            mt: 1,
                          }}
                        />
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: "#F8820B", fontWeight: "600" }}>
                          Fecha de Venta:
                        </Typography>
                        <Typography sx={{ color: "#ccc", mt: 1 }}>{formatDate(ventaEditar.sale_date)}</Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: "#F8820B", fontWeight: "600" }}>
                          Vendedor:
                        </Typography>
                        <Typography sx={{ color: "#ccc", mt: 1 }}>
                          {ventaEditar.seller_name} ({ventaEditar.seller_role})
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: "#F8820B", fontWeight: "600" }}>
                          Total de la Venta:
                        </Typography>
                        <Typography sx={{ color: "#2ecc71", fontWeight: "bold", fontSize: "18px", mt: 1 }}>
                          {formatCurrency(ventaEditar.total_sale)}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}

            {/* Mostrar mensaje si no hay productos o clientes */}
            {!loadingData && productos.length === 0 && !readonly && (
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No se encontraron productos registrados. Debes registrar productos antes de realizar ventas.
                </Alert>
              </Grid>
            )}

            {!loadingData && clientes.length === 0 && !readonly && (
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  No se encontraron clientes registrados. Debes registrar clientes antes de realizar ventas.
                </Alert>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: "#1a1a1a",
          p: 3,
          borderTop: "1px solid #333",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#FF6600",
            borderColor: "#FF6600",
            "&:hover": { borderColor: "#FF6600", bgcolor: "#FF6600", color: "#fff", fontWeight: "bold" },
          }}
          variant="outlined"
        >
          {readonly ? "Cerrar" : "Cancelar"}
        </Button>
        {!readonly && (
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <ShoppingCartIcon />}
            disabled={loading || loadingData || productos.length === 0 || clientes.length === 0}
            sx={{
              background: "#F8820B",
              color: "black",
              fontWeight: "bold",
              px: 3,
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#FF6600",
                bgcolor: "#FF6600",
                color: "black",
                fontWeight: "bold",
              },
              "&:disabled": {
                bgcolor: "#666",
                color: "#999",
              },
            }}
          >
            {loading ? "Procesando..." : "Procesar Venta"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

ModalVenta.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modoEdicion: PropTypes.bool,
  ventaEditar: PropTypes.object,
  onGuardadoExitoso: PropTypes.func.isRequired,
};

export default ModalVenta;