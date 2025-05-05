"use client"

import { useState } from "react"

// Versión simplificada sin cargar fuentes personalizadas
export default function useFonts() {
  const [fontsLoaded] = useState(true)
  return fontsLoaded
}