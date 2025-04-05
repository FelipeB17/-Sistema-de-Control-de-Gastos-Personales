"use client"

import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"
import { ArrowDownRight, ArrowUpRight, TrendingUp, Eye, X } from "lucide-react-native"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"

const Dashboard = () => {
  const { transactions } = useTransactions()
  const { format } = useCurrency()
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [detailsModalVisible, setDetailsModalVisible] = useState(false)

  const balance = transactions.reduce(
    (acc, curr) => (curr.type === "income" ? acc + curr.amount : acc - curr.amount),
    0,
  )

  const income = transactions.filter((t) => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0)

  const expenses = transactions.filter((t) => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0)

  // Get monthly expense data for the chart
  const getMonthlyExpenses = () => {
    const today = new Date()
    const monthlyData = []

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthExpenses = transactions
        .filter((t) => {
          const transDate = new Date(t.date)
          return (
            t.type === "expense" &&
            transDate.getMonth() === month.getMonth() &&
            transDate.getFullYear() === month.getFullYear()
          )
        })
        .reduce((sum, t) => sum + t.amount, 0)

      monthlyData.push(monthExpenses)
    }

    return monthlyData
  }

  const expenseTrend = getMonthlyExpenses()

  // Get month labels for the chart
  const getMonthLabels = () => {
    const today = new Date()
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    const labels = []

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      labels.push(months[month.getMonth()])
    }

    return labels
  }

  // Función para navegar a la pantalla de todas las transacciones
  const viewAllTransactions = () => {
    // Aquí iría la navegación a la pantalla de todas las transacciones
    // navigation.navigate('AllTransactions');
    alert("Esta funcionalidad estará disponible próximamente")
  }

  // Reemplazar la función viewTransactionDetails
  const viewTransactionDetails = (transaction: any) => {
    setSelectedTransaction(transaction)
    setDetailsModalVisible(true)
  }

  // Agregar el modal de detalles al final del componente, justo antes del return final
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        {/* Reemplazar la sección del header */}
        <View style={styles.header}>
          <Text style={styles.balanceText}>{format(balance)}</Text>
          <Text style={styles.headerTitle}>Balance Total</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, styles.incomeCard]}>
              <View style={styles.summaryIconContainer}>
                <ArrowUpRight color={theme.colors.success} size={20} />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Ingresos</Text>
                <Text style={styles.incomeText}>{format(income)}</Text>
              </View>
            </View>

            <View style={[styles.summaryCard, styles.expenseCard]}>
              <View style={styles.summaryIconContainer}>
                <ArrowDownRight color={theme.colors.danger} size={20} />
              </View>
              <View>
                <Text style={styles.summaryLabel}>Gastos</Text>
                <Text style={styles.expenseText}>{format(expenses)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Tendencia de Gastos</Text>
              <View style={styles.trendIconContainer}>
                <TrendingUp color={theme.colors.primary} size={18} />
              </View>
            </View>

            {expenseTrend.some((amount) => amount > 0) ? (
              <LineChart
                data={{
                  labels: getMonthLabels(),
                  datasets: [
                    {
                      data: expenseTrend.length ? expenseTrend : [0, 0, 0, 0, 0, 0],
                      color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`, // primary color
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={320}
                height={220}
                chartConfig={{
                  backgroundColor: theme.colors.card,
                  backgroundGradientFrom: theme.colors.card,
                  backgroundGradientTo: theme.colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(67, 97, 238, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: theme.colors.primary,
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: "", // solid background lines
                    stroke: "rgba(226, 232, 240, 0.6)",
                    strokeWidth: 1,
                  },
                }}
                bezier
                style={styles.chart}
              />
            ) : (
              <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>No hay datos de gastos para mostrar</Text>
              </View>
            )}
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Últimas Transacciones</Text>
              <TouchableOpacity style={styles.viewAllButton} onPress={viewAllTransactions}>
                <Eye size={16} color={theme.colors.primary} />
                <Text style={styles.viewAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {transactions.length > 0 ? (
              transactions
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((transaction) => (
                  <TouchableOpacity
                    key={transaction.id}
                    style={styles.transactionItem}
                    onPress={() => viewTransactionDetails(transaction)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor:
                            transaction.type === "income" ? theme.colors.successLight : theme.colors.dangerLight,
                        },
                      ]}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight color={theme.colors.success} size={16} />
                      ) : (
                        <ArrowDownRight color={theme.colors.danger} size={16} />
                      )}
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionCategory}>{transaction.category}</Text>
                      <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
                    </View>
                    <Text
                      style={[
                        styles.transactionAmount,
                        transaction.type === "income" ? styles.incomeText : styles.expenseText,
                      ]}
                    >
                      {transaction.type === "income" ? "+" : "-"} {format(transaction.amount)}
                    </Text>
                  </TouchableOpacity>
                ))
            ) : (
              <Text style={styles.noDataText}>No hay transacciones registradas</Text>
            )}
          </View>
        </View>

        {/* Modal para detalles de transacción */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={detailsModalVisible}
          onRequestClose={() => setDetailsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Detalles de la Transacción</Text>
                <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                  <X color={theme.colors.text} size={24} />
                </TouchableOpacity>
              </View>

              {selectedTransaction && (
                <View style={styles.modalBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Tipo:</Text>
                    <View
                      style={[
                        styles.typeTag,
                        selectedTransaction.type === "income" ? styles.incomeTag : styles.expenseTag,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeTagText,
                          { color: selectedTransaction.type === "income" ? theme.colors.success : theme.colors.danger },
                        ]}
                      >
                        {selectedTransaction.type === "income" ? "Ingreso" : "Gasto"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Categoría:</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.category}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Monto:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        selectedTransaction.type === "income" ? styles.incomeText : styles.expenseText,
                      ]}
                    >
                      {format(selectedTransaction.amount)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Fecha:</Text>
                    <Text style={styles.detailValue}>{new Date(selectedTransaction.date).toLocaleDateString()}</Text>
                  </View>

                  {selectedTransaction.description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.detailLabel}>Descripción:</Text>
                      <View style={styles.descriptionBox}>
                        <Text style={styles.descriptionText}>{selectedTransaction.description}</Text>
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.closeButton,
                      {
                        backgroundColor:
                          selectedTransaction.type === "income" ? theme.colors.success : theme.colors.danger,
                      },
                    ]}
                    onPress={() => setDetailsModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    paddingTop: 10,
    paddingBottom: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: theme.fontSizes.medium,
    marginTop: 8,
  },
  balanceText: {
    color: "white",
    fontSize: theme.fontSizes.xxlarge,
    fontWeight: "bold",
  },
  section: {
    padding: 16,
    marginTop: -30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  trendIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: theme.colors.primaryLight,
  },
  viewAllText: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.primary,
    fontWeight: "500",
    marginLeft: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionCategory: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: "500",
  },
  transactionDate: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
  noDataContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSizes.medium,
    textAlign: "center",
    marginVertical: 20,
  },
  // Estilos para el modal
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
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: "bold",
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  incomeTag: {
    backgroundColor: theme.colors.successLight,
  },
  expenseTag: {
    backgroundColor: theme.colors.dangerLight,
  },
  typeTagText: {
    fontSize: theme.fontSizes.small,
    fontWeight: "bold",
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionBox: {
    backgroundColor: theme.colors.cardAlt,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    lineHeight: 22,
  },
  closeButton: {
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  closeButtonText: {
    color: "white",
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
  },
})

export default Dashboard

