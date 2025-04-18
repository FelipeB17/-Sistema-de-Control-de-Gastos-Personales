"use client"

import type React from "react"

import { createContext, useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Transaction {
  id: string
  amount: number
  category: string
  date: string
  type: "income" | "expense"
  description?: string
}

interface TransactionContextType {
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  updateTransaction: (id: string, transaction: Omit<Transaction, "id">) => Promise<void>
  clearTransactions: () => Promise<void>
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@transactions")
      if (jsonValue != null) {
        setTransactions(JSON.parse(jsonValue))
      }
    } catch (e) {
      console.error("Failed to load transactions", e)
    }
  }

  const saveTransactions = async (newTransactions: Transaction[]) => {
    try {
      const jsonValue = JSON.stringify(newTransactions)
      await AsyncStorage.setItem("@transactions", jsonValue)
    } catch (e) {
      console.error("Failed to save transactions", e)
    }
  }

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const newTransaction = { ...transaction, id: Date.now().toString() }
    const updatedTransactions = [...transactions, newTransaction]
    setTransactions(updatedTransactions)
    await saveTransactions(updatedTransactions)
  }

  const updateTransaction = async (id: string, transaction: Omit<Transaction, "id">) => {
    const updatedTransactions = transactions.map((t) => (t.id === id ? { ...transaction, id } : t))
    setTransactions(updatedTransactions)
    await saveTransactions(updatedTransactions)
  }

  const deleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id)
    setTransactions(updatedTransactions)
    await saveTransactions(updatedTransactions)
  }

  const clearTransactions = async () => {
    try {
      await AsyncStorage.removeItem("@transactions")
      setTransactions([])
    } catch (e) {
      console.error("Failed to clear transactions", e)
      throw e
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        clearTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

export const useTransactions = () => {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error("useTransactions must be used within a TransactionProvider")
  }
  return context
}

