import AsyncStorage from "@react-native-async-storage/async-storage"

// Función para formatear moneda según la configuración
export const formatCurrency = (amount: number, currency?: string): string => {
  // Si no se proporciona moneda, intentamos obtenerla del almacenamiento
  if (!currency) {
    // Por defecto, usamos USD
    currency = "USD"
  }

  try {
    if (currency === "USD") {
      // Formato para dólares: $1,234.56
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } else if (currency === "COP") {
      // Formato para pesos colombianos: $1.234.567
      // Los pesos colombianos no usan decimales normalmente
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    // Fallback por si acaso
    return `${currency} ${amount.toFixed(2)}`
  } catch (error) {
    // Fallback simple en caso de que Intl.NumberFormat no esté disponible
    if (currency === "USD") {
      return `$${amount.toFixed(2)}`
    } else if (currency === "COP") {
      // Formato manual para pesos colombianos
      const formattedAmount = Math.round(amount)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      return `COP $${formattedAmount}`
    }
    return `${currency} ${amount.toFixed(2)}`
  }
}

// Función para obtener la moneda actual del almacenamiento
export const getCurrentCurrency = async (): Promise<string> => {
  try {
    const currency = await AsyncStorage.getItem("@currency")
    return currency || "USD" // Por defecto, USD
  } catch (error) {
    console.error("Error al obtener la moneda:", error)
    return "USD" // Por defecto, USD en caso de error
  }
}

