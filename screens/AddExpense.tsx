"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"

const AddExpense = () => {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const { addTransaction } = useTransactions()

  const handleSubmit = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    const newTransaction = {
      amount: Number.parseFloat(amount),
      category,
      date: new Date().toISOString(),
      type,
    }

    addTransaction(newTransaction)
    Alert.alert("Success", "Transaction added successfully")
    setAmount("")
    setCategory("")
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={theme.colors.textSecondary}
        />
        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g., Food, Transport"
          placeholderTextColor={theme.colors.textSecondary}
        />
        <Text style={styles.label}>Type</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === "expense" && styles.activeTypeButton]}
            onPress={() => setType("expense")}
          >
            <Text style={[styles.typeButtonText, type === "expense" && styles.activeTypeButtonText]}>Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === "income" && styles.activeTypeButton]}
            onPress={() => setType("income")}
          >
            <Text style={[styles.typeButtonText, type === "income" && styles.activeTypeButtonText]}>Income</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 4,
    alignItems: "center",
  },
  activeTypeButton: {
    backgroundColor: theme.colors.primary,
  },
  typeButtonText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  activeTypeButtonText: {
    color: theme.colors.card,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.card,
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
})

export default AddExpense

