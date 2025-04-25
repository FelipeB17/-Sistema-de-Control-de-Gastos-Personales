// Definimos un tema base y luego temas específicos para claro y oscuro
const baseTheme = {
  fontSizes: {
    xs: 10,
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
}

// Tema claro
const lightTheme = {
  ...baseTheme,
  colors: {
    // Colores principales - Paleta mejorada
    background: "#F5F7FA", // Fondo gris muy claro con toque azulado
    card: "#FFFFFF",
    cardAlt: "#F8FAFF", // Color alternativo para tarjetas

    // Colores de texto
    text: "#2D3748",
    textSecondary: "#718096",

    // Colores de acento - Paleta más armoniosa
    primary: "#4361EE", // Azul más vibrante
    primaryLight: "#EEF2FF", // Azul claro para fondos
    secondary: "#F9A826", // Naranja más cálido
    secondaryLight: "#FFF8E6", // Naranja claro para fondos
    accent: "#7209B7", // Púrpura más intenso
    accentLight: "#F3E8FF", // Púrpura claro para fondos

    // Colores de estado - Más vibrantes pero armoniosos
    success: "#06D6A0", // Verde turquesa
    successLight: "#E6FFF8", // Verde claro para fondos
    danger: "#EF476F", // Rojo rosado
    dangerLight: "#FFF0F3", // Rojo claro para fondos
    warning: "#FFD166", // Amarillo más cálido
    warningLight: "#FFFBEB", // Amarillo claro para fondos

    // Colores de borde
    border: "#E2E8F0",

    // Colores para gráficos - Paleta más armoniosa
    chartColors: [
      "#4361EE", // Azul
      "#F9A826", // Naranja
      "#7209B7", // Púrpura
      "#06D6A0", // Verde turquesa
      "#EF476F", // Rojo rosado
      "#FFD166", // Amarillo
      "#118AB2", // Azul turquesa
      "#073B4C", // Azul oscuro
      "#9D4EDD", // Lavanda
      "#FF6B6B", // Coral
    ],
  },
}

// Tema oscuro
const darkTheme = {
  ...baseTheme,
  colors: {
    // Colores principales
    background: "#121212", // Fondo oscuro
    card: "#1E1E1E", // Tarjetas un poco más claras que el fondo
    cardAlt: "#252525", // Color alternativo para tarjetas

    // Colores de texto
    text: "#E4E6EB", // Texto principal claro
    textSecondary: "#B0B3B8", // Texto secundario más apagado

    // Colores de acento - Mantenemos similares pero ajustados para oscuro
    primary: "#4361EE", // Mantenemos el azul vibrante
    primaryLight: "#1A1F36", // Versión oscura del azul claro
    secondary: "#F9A826", // Mantenemos el naranja
    secondaryLight: "#332917", // Versión oscura del naranja claro
    accent: "#7209B7", // Mantenemos el púrpura
    accentLight: "#231536", // Versión oscura del púrpura claro

    // Colores de estado - Ajustados para modo oscuro
    success: "#06D6A0", // Mantenemos el verde turquesa
    successLight: "#0F2922", // Versión oscura del verde claro
    danger: "#EF476F", // Mantenemos el rojo rosado
    dangerLight: "#2C1A22", // Versión oscura del rojo claro
    warning: "#FFD166", // Mantenemos el amarillo
    warningLight: "#332B19", // Versión oscura del amarillo claro

    // Colores de borde
    border: "#3E3E3E", // Bordes más claros que el fondo

    // Colores para gráficos - Mantenemos la misma paleta
    chartColors: [
      "#4361EE", // Azul
      "#F9A826", // Naranja
      "#7209B7", // Púrpura
      "#06D6A0", // Verde turquesa
      "#EF476F", // Rojo rosado
      "#FFD166", // Amarillo
      "#118AB2", // Azul turquesa
      "#073B4C", // Azul oscuro
      "#9D4EDD", // Lavanda
      "#FF6B6B", // Coral
    ],
  },
}

// Exportamos un objeto que contiene ambos temas
export const themes = {
  light: lightTheme,
  dark: darkTheme,
}

// Por defecto exportamos el tema claro para compatibilidad con el código existente
export const theme = lightTheme
