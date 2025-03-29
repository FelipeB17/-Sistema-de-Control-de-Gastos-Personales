"use client"

import { useState } from "react"

// Versión simplificada sin cargar fuentes personalizadas
export default function useFonts() {
  const [fontsLoaded] = useState(true)
  return fontsLoaded
}

// Cuando quieras implementar fuentes personalizadas:
// 1. Instala expo-font: npx expo install expo-font
// 2. Añade tus archivos de fuentes en la carpeta assets/fonts/
// 3. Descomenta y usa este código:

/*
import { useEffect, useState } from "react"
import * as Font from "expo-font"

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          // Carga tus fuentes aquí
          "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
          "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
        })
        setFontsLoaded(true)
      } catch (error) {
        console.error("Error loading fonts", error)
      }
    }

    loadFonts()
  }, [])

  return fontsLoaded
}
*/

