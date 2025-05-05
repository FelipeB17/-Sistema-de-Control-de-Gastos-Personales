"use client"

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from "react-native"
import { useState } from "react"
import { PieChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { useTheme } from "../context/ThemeContext"
import { useCurrency } from "../hooks/useCurrency"
import { Calendar, DollarSign, TrendingDown, TrendingUp, ArrowLeft, ArrowRight, Eye, X } from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Reports = () => {
  const { transactions } = useTransactions()
  const { format, currency, convert } = useCurrency()
  const { theme } = useTheme()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categoryTransactions, setCategoryTransactions] = useState<any[]>([])

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const filteredTransactions = transactions.filter((t) => {
    const date = new Date(t.date)
    return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear
  })

  // Función para convertir montos según la moneda actual
  const getConvertedAmount = (amount: number) => {
    if (currency === "COP") {
      return amount
    }
    // Si la moneda es USD, convertimos de COP a USD
    return amount / 3800
  }

  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, curr) => {
        const convertedAmount = getConvertedAmount(curr.amount)
        acc[curr.category] = (acc[curr.category] || 0) + convertedAmount
        return acc
      },
      {} as Record<string, number>,
    )

  const chartData = Object.entries(expensesByCategory).map(([name, population], index) => ({
    name,
    population,
    color: theme.colors.chartColors[index % theme.colors.chartColors.length],
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }))

  const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0)
  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + getConvertedAmount(curr.amount), 0)
  const balance = totalIncome - totalExpenses

  const changeMonth = (increment: number) => {
    let newMonth = selectedMonth + increment
    let newYear = selectedYear

    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }

    setSelectedMonth(newMonth)
    setSelectedYear(newYear)
  }

  const viewTransactionsByCategory = (category: string) => {
    const categoryTrans = filteredTransactions.filter((t) => t.type === "expense" && t.category === category)

    if (categoryTrans.length === 0) {
      Alert.alert("Sin datos", `No hay transacciones en la categoría ${category} para este mes.`)
      return
    }

    setSelectedCategory(category)
    setCategoryTransactions(categoryTrans)
    setCategoryModalVisible(true)
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.primary }]} edges={["top"]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>Análisis Financiero</Text>
        </View>

        <View style={styles.content}>
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <View style={styles.monthSelector}>
              <TouchableOpacity
                style={[styles.arrowButton, { backgroundColor: theme.colors.primaryLight }]}
                onPress={() => changeMonth(-1)}
              >
                <ArrowLeft color={theme.colors.primary} size={24} />
              </TouchableOpacity>
              <View style={styles.monthYearContainer}>
                <Calendar color={theme.colors.primary} size={20} />
                <Text style={[styles.monthYearText, { color: theme.colors.text }]}>
                  {`${months[selectedMonth]} ${selectedYear}`}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.arrowButton, { backgroundColor: theme.colors.primaryLight }]}
                onPress={() => changeMonth(1)}
              >
                <ArrowRight color={theme.colors.primary} size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <View
              style={[
                styles.summaryCard,
                styles.incomeCard,
                { backgroundColor: theme.colors.card, borderLeftColor: theme.colors.success },
              ]}
            >
              <View style={styles.summaryIconContainer}>
                <TrendingUp color={theme.colors.success} size={20} />
              </View>
              <View>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Ingresos</Text>
                <Text style={[styles.incomeText, { color: theme.colors.success }]}>{format(totalIncome)}</Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                styles.expenseCard,
                { backgroundColor: theme.colors.card, borderLeftColor: theme.colors.danger },
              ]}
            >
              <View style={styles.summaryIconContainer}>
                <TrendingDown color={theme.colors.danger} size={20} />
              </View>
              <View>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Gastos</Text>
                <Text style={[styles.expenseText, { color: theme.colors.danger }]}>{format(totalExpenses)}</Text>
              </View>
            </View>

            <View
              style={[
                styles.summaryCard,
                styles.balanceCard,
                { backgroundColor: theme.colors.card, borderLeftColor: theme.colors.primary },
              ]}
            >
              <View style={styles.summaryIconContainer}>
                <DollarSign color={theme.colors.primary} size={20} />
              </View>
              <View>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Balance</Text>
                <Text
                  style={[
                    styles.balanceText,
                    { color: theme.colors.primary },
                    balance < 0 && { color: theme.colors.danger },
                  ]}
                >
                  {format(balance)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Gastos por Categoría</Text>
            {chartData.length > 0 ? (
              <View>
                <PieChart
                  data={chartData}
                  width={320}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.colors.card,
                    backgroundGradientFrom: theme.colors.card,
                    backgroundGradientTo: theme.colors.card,
                    decimalPlaces: currency === "USD" ? 2 : 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => theme.colors.text,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  center={[10, 0]}
                  absolute
                  hasLegend={false}
                  style={styles.chart}
                />

                <View style={styles.legendContainer}>
                  {chartData.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.legendItem, { backgroundColor: theme.colors.cardAlt }]}
                      onPress={() => viewTransactionsByCategory(item.name)}
                    >
                      <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                      <Text style={[styles.legendText, { color: theme.colors.text }]}>{item.name}</Text>
                      <Text style={[styles.legendValue, { color: theme.colors.primary }]}>
                        {format(item.population)}
                      </Text>
                      <Eye size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>
                  No hay datos de gastos para este mes
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Principales Gastos</Text>
            {Object.entries(expensesByCategory).length > 0 ? (
              Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount], index) => (
                  <TouchableOpacity
                    key={category}
                    style={[styles.expenseRow, { borderBottomColor: theme.colors.border }]}
                    onPress={() => viewTransactionsByCategory(category)}
                  >
                    <View style={styles.categoryIndicator}>
                      <View
                        style={[
                          styles.colorIndicator,
                          { backgroundColor: theme.colors.chartColors[index % theme.colors.chartColors.length] },
                        ]}
                      />
                      <Text style={[styles.categoryText, { color: theme.colors.text }]}>{category}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text style={[styles.amountText, { color: theme.colors.primary }]}>{format(amount)}</Text>
                      <Text style={[styles.percentageText, { color: theme.colors.textSecondary }]}>
                        {totalExpenses > 0 ? `${Math.round((amount / totalExpenses) * 100)}%` : "0%"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>
                No hay gastos registrados para este mes
              </Text>
            )}
          </View>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={categoryModalVisible}
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
              <View style={[styles.modalHeader, { borderBottomColor: theme.colors.border }]}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Gastos en {selectedCategory}</Text>
                <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                  <X color={theme.colors.text} size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={[styles.categoryTotalContainer, { backgroundColor: theme.colors.dangerLight }]}>
                  <Text style={[styles.categoryTotalLabel, { color: theme.colors.text }]}>Total gastado:</Text>
                  <Text style={[styles.categoryTotalAmount, { color: theme.colors.danger }]}>
                    {format(categoryTransactions.reduce((sum, t) => sum + getConvertedAmount(t.amount), 0))}
                  </Text>
                </View>

                <Text style={[styles.transactionsListTitle, { color: theme.colors.text }]}>Transacciones:</Text>

                <FlatList
                  data={categoryTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                  keyExtractor={(item) => item.id}
                  style={styles.transactionsList}
                  renderItem={({ item }) => (
                    <View style={[styles.transactionItem, { backgroundColor: theme.colors.cardAlt }]}>
                      <View style={styles.transactionHeader}>
                        <View style={styles.transactionDateContainer}>
                          <Calendar size={16} color={theme.colors.primary} />
                          <Text style={[styles.transactionDate, { color: theme.colors.text }]}>
                            {new Date(item.date).toLocaleDateString()}
                          </Text>
                        </View>
                        <Text style={[styles.transactionAmount, { color: theme.colors.danger }]}>
                          {format(getConvertedAmount(item.amount))}
                        </Text>
                      </View>

                      {item.description && (
                        <View style={[styles.transactionDescription, { backgroundColor: "white" }]}>
                          <Text style={[styles.descriptionText, { color: theme.colors.text }]}>{item.description}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  ListEmptyComponent={
                    <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>
                      No hay transacciones para mostrar
                    </Text>
                  }
                />

                <TouchableOpacity
                  style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setCategoryModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingTop: 50, // Aumentado para evitar la isla dinámica
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
  content: {
    padding: 16,
    marginTop: -20,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  monthYearContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthYearText: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 8,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  incomeCard: {
    borderLeftWidth: 4,
  },
  expenseCard: {
    borderLeftWidth: 4,
  },
  balanceCard: {
    borderLeftWidth: 4,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  incomeText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  negativeBalance: {
    color: "#EF476F",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chart: {
    alignSelf: "center",
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: 16,
  },
  legendValue: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  categoryIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  percentageText: {
    fontSize: 12,
    textAlign: "right",
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalBody: {
    padding: 16,
    maxHeight: "90%",
  },
  categoryTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryTotalLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  categoryTotalAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  transactionsListTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  transactionsList: {
    maxHeight: 300,
  },
  transactionItem: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  transactionDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 12,
    marginLeft: 6,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionDescription: {
    borderRadius: 8,
    padding: 8,
  },
  descriptionText: {
    fontSize: 12,
  },
  closeButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default Reports
