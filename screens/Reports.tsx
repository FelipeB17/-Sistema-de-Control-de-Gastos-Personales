"use client"

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, FlatList, Alert } from "react-native"
import { useState } from "react"
import { PieChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"
import { Calendar, DollarSign, TrendingDown, TrendingUp, ArrowLeft, ArrowRight, Eye, X } from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const Reports = () => {
  const { transactions } = useTransactions()
  const { format } = useCurrency()
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

  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount
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
    .reduce((acc, curr) => acc + curr.amount, 0)
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
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Análisis Financiero</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.monthSelectorCard}>
            <View style={styles.monthSelector}>
              <TouchableOpacity style={styles.arrowButton} onPress={() => changeMonth(-1)}>
                <ArrowLeft color={theme.colors.primary} size={24} />
              </TouchableOpacity>
              <View style={styles.monthYearContainer}>
                <Calendar color={theme.colors.primary} size={20} />
                <Text style={styles.monthYearText}>{`${months[selectedMonth]} ${selectedYear}`}</Text>
              </View>
              <TouchableOpacity style={styles.arrowButton} onPress={() => changeMonth(1)}>
                <ArrowRight color={theme.colors.primary} size={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, styles.incomeCard]}>
              <View style={styles.summaryIconContainer}>
                <TrendingUp color={theme.colors.success} size={20} />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Ingresos</Text>
                <Text style={styles.incomeText}>{format(totalIncome)}</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, styles.expenseCard]}>
              <View style={styles.summaryIconContainer}>
                <TrendingDown color={theme.colors.danger} size={20} />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Gastos</Text>
                <Text style={styles.expenseText}>{format(totalExpenses)}</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, styles.balanceCard]}>
              <View style={styles.summaryIconContainer}>
                <DollarSign color={theme.colors.primary} size={20} />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Balance</Text>
                <Text style={[styles.balanceText, balance < 0 && styles.negativeBalance]}>{format(balance)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Gastos por Categoría</Text>
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
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                      style={styles.legendItem}
                      onPress={() => viewTransactionsByCategory(item.name)}
                    >
                      <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.name}</Text>
                      <Text style={styles.legendValue}>{format(item.population)}</Text>
                      <Eye size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No hay datos de gastos para este mes</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Principales Gastos</Text>
            {Object.entries(expensesByCategory).length > 0 ? (
              Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([category, amount], index) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.expenseRow}
                    onPress={() => viewTransactionsByCategory(category)}
                  >
                    <View style={styles.categoryIndicator}>
                      <View
                        style={[
                          styles.colorIndicator,
                          { backgroundColor: theme.colors.chartColors[index % theme.colors.chartColors.length] },
                        ]}
                      />
                      <Text style={styles.categoryText}>{category}</Text>
                    </View>
                    <View style={styles.amountContainer}>
                      <Text style={styles.amountText}>{format(amount)}</Text>
                      <Text style={styles.percentageText}>
                        {totalExpenses > 0 ? `${Math.round((amount / totalExpenses) * 100)}%` : "0%"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
            ) : (
              <Text style={styles.noDataText}>No hay gastos registrados para este mes</Text>
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
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Gastos en {selectedCategory}</Text>
                <TouchableOpacity onPress={() => setCategoryModalVisible(false)}>
                  <X color={theme.colors.text} size={24} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.categoryTotalContainer}>
                  <Text style={styles.categoryTotalLabel}>Total gastado:</Text>
                  <Text style={styles.categoryTotalAmount}>
                    {format(categoryTransactions.reduce((sum, t) => sum + t.amount, 0))}
                  </Text>
                </View>

                <Text style={styles.transactionsListTitle}>Transacciones:</Text>

                <FlatList
                  data={categoryTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
                  keyExtractor={(item) => item.id}
                  style={styles.transactionsList}
                  renderItem={({ item }) => (
                    <View style={styles.transactionItem}>
                      <View style={styles.transactionHeader}>
                        <View style={styles.transactionDateContainer}>
                          <Calendar size={16} color={theme.colors.primary} />
                          <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.transactionAmount}>{format(item.amount)}</Text>
                      </View>

                      {item.description && (
                        <View style={styles.transactionDescription}>
                          <Text style={styles.descriptionText}>{item.description}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  ListEmptyComponent={<Text style={styles.noDataText}>No hay transacciones para mostrar</Text>}
                />

                <TouchableOpacity style={styles.closeButton} onPress={() => setCategoryModalVisible(false)}>
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
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    marginTop: -30,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  monthSelectorCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.colors.primaryLight,
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
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthYearContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  monthYearText: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
    marginLeft: 8,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.card,
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
    borderLeftColor: theme.colors.success,
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
  },
  balanceCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
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
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  incomeText: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.success,
  },
  expenseText: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.danger,
  },
  balanceText: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  negativeBalance: {
    color: theme.colors.danger,
  },
  cardTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
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
    backgroundColor: theme.colors.cardAlt,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    flex: 1,
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  legendValue: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginRight: 8,
  },
  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amountText: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.primary,
    textAlign: "right",
  },
  percentageText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
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
    backgroundColor: theme.colors.card,
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
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  modalBody: {
    padding: 16,
    maxHeight: "90%",
  },
  categoryTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.dangerLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryTotalLabel: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: "500",
  },
  categoryTotalAmount: {
    fontSize: theme.fontSizes.large,
    color: theme.colors.danger,
    fontWeight: "bold",
  },
  transactionsListTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  transactionsList: {
    maxHeight: 300,
  },
  transactionItem: {
    backgroundColor: theme.colors.cardAlt,
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
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
    marginLeft: 6,
  },
  transactionAmount: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.danger,
  },
  transactionDescription: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
  },
  descriptionText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.text,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "white",
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
})

export default Reports

