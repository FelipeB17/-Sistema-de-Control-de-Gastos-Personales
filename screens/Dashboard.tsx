import { View, Text, ScrollView, StyleSheet } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"

const Dashboard = () => {
  const { transactions } = useTransactions()
  const { format } = useCurrency()

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Balance</Text>
          <Text style={[styles.balance, balance < 0 && styles.negativeBalance]}>{format(balance)}</Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Ingresos</Text>
            <Text style={styles.income}>{format(income)}</Text>
          </View>
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Gastos</Text>
            <Text style={styles.expense}>{format(expenses)}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tendencia de Gastos</Text>
          {expenseTrend.some((amount) => amount > 0) ? (
            <LineChart
              data={{
                labels: getMonthLabels(),
                datasets: [{ data: expenseTrend.length ? expenseTrend : [0, 0, 0, 0, 0, 0] }],
              }}
              width={300}
              height={200}
              chartConfig={{
                backgroundColor: theme.colors.card,
                backgroundGradientFrom: theme.colors.card,
                backgroundGradientTo: theme.colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                style: {
                  borderRadius: 16,
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
          <Text style={styles.cardTitle}>Últimas Transacciones</Text>
          {transactions.length > 0 ? (
            transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View>
                    <Text style={styles.transactionCategory}>{transaction.category}</Text>
                    <Text style={styles.transactionDate}>{new Date(transaction.date).toLocaleDateString()}</Text>
                  </View>
                  <Text
                    style={[styles.transactionAmount, transaction.type === "income" ? styles.income : styles.expense]}
                  >
                    {transaction.type === "income" ? "+" : "-"} {format(transaction.amount)}
                  </Text>
                </View>
              ))
          ) : (
            <Text style={styles.noDataText}>No hay transacciones registradas</Text>
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
  halfCard: {
    flex: 1,
    marginHorizontal: 4,
  },
  cardTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 8,
  },
  balance: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: "bold",
    color: theme.colors.success,
  },
  negativeBalance: {
    color: theme.colors.danger,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  income: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.success,
  },
  expense: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.danger,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
})

export default Dashboard

