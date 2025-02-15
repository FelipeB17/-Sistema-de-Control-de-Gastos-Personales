import { View, Text, ScrollView, StyleSheet } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"

const Dashboard = () => {
  const { transactions } = useTransactions()

  const balance = transactions.reduce(
    (acc, curr) => (curr.type === "income" ? acc + curr.amount : acc - curr.amount),
    0,
  )

  const income = transactions.filter((t) => t.type === "income").reduce((acc, curr) => acc + curr.amount, 0)

  const expenses = transactions.filter((t) => t.type === "expense").reduce((acc, curr) => acc + curr.amount, 0)

  // Simplified expense trend data
  const expenseTrend = [expenses, expenses, expenses, expenses, expenses, expenses]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Balance</Text>
          <Text style={[styles.balance, balance < 0 && styles.negativeBalance]}>${balance.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Income</Text>
            <Text style={styles.income}>${income.toFixed(2)}</Text>
          </View>
          <View style={[styles.card, styles.halfCard]}>
            <Text style={styles.cardTitle}>Expenses</Text>
            <Text style={styles.expense}>${expenses.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expense Trend</Text>
          <LineChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
              datasets: [{ data: expenseTrend }],
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
  },
})

export default Dashboard

