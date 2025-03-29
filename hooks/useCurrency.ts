"use client"

import { useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function useCurrency() {
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

  const format = (amount: number) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    } else if (currency === "COP") {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      }).format(amount)
    }
    return `${currency} ${amount.toFixed(2)}`
  }

  return {
    currency,
    changeCurrency,
    format,
    isLoading,
  }
}

