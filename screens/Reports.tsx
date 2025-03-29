"use client"

import { useState } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"

const Reports = () => {
  const { transactions } = useTransactions()
  const { format } = useCurrency()
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

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

  const chartColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#FF6384",
    "#C9CBCF",
    "#4BC0C0",
    "#FF6384",
  ]

  const chartData = Object.entries(expensesByCategory).map(([name, population], index) => ({
    name,
    population,
    color: chartColors[index % chartColors.length],
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.monthSelector}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Text style={styles.monthButton}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{`${months[selectedMonth]} ${selectedYear}`}</Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Text style={styles.monthButton}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={styles.summaryValue}>{format(totalIncome)}</Text>
          </View>
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>Gastos</Text>
            <Text style={styles.summaryValue}>{format(totalExpenses)}</Text>
          </View>
          <View style={[styles.summaryCard, styles.balanceCard]}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={[styles.summaryValue, balance < 0 && styles.negativeBalance]}>{format(balance)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gastos por Categoría</Text>
          {chartData.length > 0 ? (
            <PieChart
              data={chartData}
              width={300}
              height={200}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
              style={styles.chart}
            />
          ) : (
            <Text style={styles.noDataText}>No hay datos de gastos para este mes</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Principales Gastos</Text>
          {Object.entries(expensesByCategory).length > 0 ? (
            Object.entries(expensesByCategory)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([category, amount], index) => (
                <View key={category} style={styles.expenseRow}>
                  <View style={styles.categoryIndicator}>
                    <View
                      style={[styles.colorIndicator, { backgroundColor: chartColors[index % chartColors.length] }]}
                    />
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                  <View>
                    <Text style={styles.amountText}>{format(amount)}</Text>
                    <Text style={styles.percentageText}>
                      {totalExpenses > 0 ? `${Math.round((amount / totalExpenses) * 100)}%` : "0%"}
                    </Text>
                  </View>
                </View>
              ))
          ) : (
            <Text style={styles.noDataText}>No hay gastos registrados para este mes</Text>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    padding: 16,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
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
  noDataText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginVertical: 20,
  },
  monthSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    padding: 12,
  },
  monthText: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  monthButton: {
    fontSize: theme.fontSizes.large,
    color: theme.colors.primary,
    paddingHorizontal: 10,
    fontWeight: "bold",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  incomeCard: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  expenseCard: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  balanceCard: {
    backgroundColor: "rgba(15, 82, 186, 0.1)",
  },
  summaryLabel: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  negativeBalance: {
    color: theme.colors.danger,
  },
  chart: {
    alignSelf: "center",
  },
})

export default Reports

