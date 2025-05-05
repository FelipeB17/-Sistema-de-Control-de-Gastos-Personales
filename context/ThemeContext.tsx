"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { themes } from "../theme"

type ThemeContextType = {
  isDarkMode: boolean
  toggleTheme: () => Promise<void>
  theme: typeof themes.light
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    loadThemePreference()
  }, [])

  const loadThemePreference = async () => {
    try {
      const savedDarkMode = await AsyncStorage.getItem("@darkMode")
      if (savedDarkMode) {
        setIsDarkMode(JSON.parse(savedDarkMode))
      }
    } catch (error) {
      console.error("Error loading theme preference", error)
    }
  }

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode
      setIsDarkMode(newMode)
      await AsyncStorage.setItem("@darkMode", JSON.stringify(newMode))
    } catch (error) {
      console.error("Error saving theme preference", error)
    }
  }

  // Selecciona el tema basado en el modo
  const theme = isDarkMode ? themes.dark : themes.light

  return <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
