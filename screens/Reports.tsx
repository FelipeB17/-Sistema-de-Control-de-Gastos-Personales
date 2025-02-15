import { View, Text, ScrollView, StyleSheet } from "react-native"
import { PieChart } from "react-native-chart-kit"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"

const Reports = () => {
  const { transactions } = useTransactions()

  const expensesByCategory = transactions
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
    color: `hsl(${index * 137.508}deg, 50%, 50%)`,
    legendFontColor: theme.colors.text,
    legendFontSize: 12,
  }))

  const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0)

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Expenses by Category</Text>
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
            />
          ) : (
            <Text style={styles.noDataText}>No expense data available</Text>
          )}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Expenses</Text>
          {Object.entries(expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([category, amount]) => (
              <View key={category} style={styles.row}>
                <Text style={styles.categoryText}>{category}</Text>
                <Text style={styles.amountText}>${amount.toFixed(2)}</Text>
              </View>
            ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Expenses</Text>
          <Text style={styles.totalExpenses}>${totalExpenses.toFixed(2)}</Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  amountText: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  totalExpenses: {
    fontSize: theme.fontSizes.xlarge,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  noDataText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
})

export default Reports

