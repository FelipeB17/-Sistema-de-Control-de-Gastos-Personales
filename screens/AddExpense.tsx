"use client"

import { useState, useCallback } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native"
import { useTransactions } from "../context/TransactionContext"
import { useTheme } from "../context/ThemeContext"
import { useCurrency } from "../hooks/useCurrency"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Platform } from "react-native"
import { Calendar, DollarSign, Tag, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"

// Mejorar la diferenciación entre gastos e ingresos
// Primero, modificar los tipos de transacción para incluir más información
// Agregar constantes para los tipos de transacción
const transactionTypes = [
  {
    id: "expense",
    label: "Gasto",
    icon: ArrowDownRight,
    color: "#EF476F", // theme.colors.danger
    lightColor: "#FFF0F3", // theme.colors.dangerLight
    description: "Registra un gasto o salida de dinero",
    placeholders: {
      description: "Ej: Compra en supermercado, Pago de servicios, etc.",
      categories: [
        "Alimentación",
        "Transporte",
        "Vivienda",
        "Entretenimiento",
        "Salud",
        "Educación",
        "Ropa",
        "Servicios",
        "Otros",
      ],
    },
  },
  {
    id: "income",
    label: "Ingreso",
    icon: ArrowUpRight,
    color: "#06D6A0", // theme.colors.success
    lightColor: "#E6FFF8", // theme.colors.successLight
    description: "Registra un ingreso o entrada de dinero",
    placeholders: {
      description: "Ej: Salario, Venta, Préstamo, Regalo, etc.",
      categories: ["Salario", "Ventas", "Inversiones", "Regalos", "Reembolsos", "Préstamos", "Otros"],
    },
  },
]

const AddExpense = () => {
  // Modificar el estado para usar el tipo seleccionado
  const [type, setType] = useState<"expense" | "income">("expense")
  const [categories, setCategories] = useState(transactionTypes[0].placeholders.categories)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const { addTransaction } = useTransactions()
  const { currency, format } = useCurrency()
  const { theme } = useTheme()

  // Actualizar la función que cambia el tipo para que también actualice las categorías
  const handleTypeChange = useCallback(
    (newType: "expense" | "income") => {
      setType(newType)
      const selectedTypeInfo = transactionTypes.find((t) => t.id === newType)
      if (selectedTypeInfo) {
        setCategories(selectedTypeInfo.placeholders.categories)
        // Si la categoría actual no está en las nuevas categorías, resetearla
        if (!selectedTypeInfo.placeholders.categories.includes(category)) {
          setCategory("")
        }
      }
    },
    [category],
  )

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

          // Eliminamos la navegación que causa el error
          // En lugar de navegar, simplemente reseteamos el formulario
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.primary }]} edges={["top"]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Eliminar el título duplicado en AddExpense
        // Reemplazar la sección del header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>Nueva Transacción</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            {/* Actualizar el renderizado de los botones de tipo */}
            <View style={styles.typeSelector}>
              {transactionTypes.map((typeInfo) => (
                <TouchableOpacity
                  key={typeInfo.id}
                  style={[
                    styles.typeButton,
                    type === typeInfo.id
                      ? { backgroundColor: typeInfo.color }
                      : { backgroundColor: theme.colors.card, borderWidth: 1, borderColor: theme.colors.border },
                  ]}
                  onPress={() => handleTypeChange(typeInfo.id as "expense" | "income")}
                >
                  <typeInfo.icon color={type === typeInfo.id ? "white" : typeInfo.color} size={20} />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === typeInfo.id ? { color: "white" } : { color: typeInfo.color },
                    ]}
                  >
                    {typeInfo.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <DollarSign color={theme.colors.primary} size={18} />
                <Text style={[styles.label, { color: theme.colors.text }]}>Monto ({currency})</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.cardAlt,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Tag color={theme.colors.primary} size={18} />
                <Text style={[styles.label, { color: theme.colors.text }]}>Categoría</Text>
              </View>
              <View style={styles.categoriesContainer}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: theme.colors.cardAlt,
                        borderColor: theme.colors.border,
                      },
                      category === cat && [styles.selectedCategoryChip, { backgroundColor: theme.colors.primary }],
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: theme.colors.text },
                        category === cat && styles.selectedCategoryChipText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <FileText color={theme.colors.primary} size={18} />
                <Text style={[styles.label, { color: theme.colors.text }]}>Descripción (opcional)</Text>
              </View>
              {/* Actualizar el placeholder de la descripción */}
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.colors.cardAlt,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder={transactionTypes.find((t) => t.id === type)?.placeholders.description || ""}
                placeholderTextColor={theme.colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Calendar color={theme.colors.primary} size={18} />
                <Text style={[styles.label, { color: theme.colors.text }]}>Fecha</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.dateButton,
                  {
                    backgroundColor: theme.colors.cardAlt,
                    borderColor: theme.colors.border,
                  },
                ]}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={[styles.dateButtonText, { color: theme.colors.text }]}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>

              {showDatePicker && (
                <View style={[styles.datePickerContainer, { backgroundColor: theme.colors.cardAlt }]}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    textColor={theme.colors.text}
                  />
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.submitButton, type === "income" ? styles.incomeSubmitButton : styles.expenseSubmitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>{type === "income" ? "Agregar Ingreso" : "Agregar Gasto"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 16,
    marginTop: -20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeExpenseButton: {
    backgroundColor: "#EF476F",
  },
  activeIncomeButton: {
    backgroundColor: "#06D6A0",
  },
  inactiveButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  activeButtonText: {
    color: "white",
  },
  inactiveExpenseText: {
    color: "#EF476F",
  },
  inactiveIncomeText: {
    color: "#06D6A0",
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  categoryChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
  },
  selectedCategoryChip: {
    borderColor: "transparent",
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  selectedCategoryChipText: {
    color: "white",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    textAlign: "center",
  },
  datePickerContainer: {
    marginTop: 10,
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
  },
  submitButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  expenseSubmitButton: {
    backgroundColor: "#EF476F",
  },
  incomeSubmitButton: {
    backgroundColor: "#06D6A0",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default AddExpense
