"use client"

import React, { useState, useEffect, useContext, createContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Tasa de conversión fija (en una app real, esto vendría de una API)
const CONVERSION_RATE = 3800 // 1 USD = 3800 COP

type CurrencyContextType = {
  currency: string
  changeCurrency: (newCurrency: string) => Promise<void>
  format: (amount: number) => string
  convert: (amount: number, targetCurrency?: string) => number
  isLoading: boolean
}

// Crear el contexto con un valor por defecto undefined
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Proveedor del contexto
export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>("COP")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    loadCurrency()
  }, [])

  const loadCurrency = async () => {
    try {
      const savedCurrency = await AsyncStorage.getItem("@currency")
      if (savedCurrency) {
        setCurrency(savedCurrency)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading currency", error)
      setIsLoading(false)
    }
  }

  const changeCurrency = async (newCurrency: string) => {
    try {
      setCurrency(newCurrency)
      await AsyncStorage.setItem("@currency", newCurrency)
    } catch (error) {
      console.error("Error saving currency", error)
    }
  }

  // Convierte un monto a la moneda especificada
  const convert = (amount: number, targetCurrency?: string) => {
    const currencyToUse = targetCurrency || currency

    if (currencyToUse === "USD") {
      return amount / CONVERSION_RATE // Convertir de COP a USD
    } else {
      return amount * CONVERSION_RATE // Convertir de USD a COP
    }
  }

  // Formatea un monto según la moneda actual
  const format = (amount: number) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } else if (currency === "COP") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return `${currency} ${amount.toFixed(2)}`
  }

  const value = {
    currency,
    changeCurrency,
    format,
    convert,
    isLoading,
  }

  return React.createElement(CurrencyContext.Provider, { value }, children)
}

// Hook personalizado para usar el contexto
export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
