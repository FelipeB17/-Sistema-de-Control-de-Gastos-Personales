"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Platform } from "react-native"

const categories = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Ropa",
  "Servicios",
  "Otros",
]

const AddExpense = ({ navigation }: any) => {
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { addTransaction } = useTransactions()
  const { currency, format } = useCurrency()

  const handleSubmit = () => {
    if (!amount || !category) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios")
      return
    }

    const newTransaction = {
      amount: Number.parseFloat(amount),
      category,
      description,
      date: date.toISOString(),
      type,
    }

    addTransaction(newTransaction)
    Alert.alert("Éxito", `Transacción agregada: ${format(Number.parseFloat(amount))}`, [
      {
        text: "OK",
        onPress: () => {
          // Reset form
          setAmount("")
          setCategory("")
          setDescription("")
          setDate(new Date())
          setType("expense")

          // Navigate back to dashboard
          navigation.navigate("Dashboard")
        },
      },
    ])
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date
    setShowDatePicker(Platform.OS === "ios")
    setDate(currentDate)
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Monto ({currency})</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor={theme.colors.textSecondary}
        />

        <Text style={styles.label}>Categoría</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.selectedCategoryChip]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryChipText, category === cat && styles.selectedCategoryChipText]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Descripción (opcional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Añade detalles sobre esta transacción"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}

        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeContainer}>
          <TouchableOpacity
            style={[styles.typeButton, type === "expense" && styles.activeTypeButton]}
            onPress={() => setType("expense")}
          >
            <Text style={[styles.typeButtonText, type === "expense" && styles.activeTypeButtonText]}>Gasto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === "income" && styles.activeTypeButton]}
            onPress={() => setType("income")}
          >
            <Text style={[styles.typeButtonText, type === "income" && styles.activeTypeButtonText]}>Ingreso</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Agregar Transacción</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    fontWeight: "500",
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
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  categoryChip: {
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.small,
  },
  selectedCategoryChipText: {
    color: "white",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  dateButtonText: {
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
    marginHorizontal: 4,
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

