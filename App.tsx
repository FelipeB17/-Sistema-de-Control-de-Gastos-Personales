import { View, Text, ScrollView, StyleSheet } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { PieChart, LineChart } from "react-native-chart-kit"
import { PlusCircle, PieChart as PieChartIcon, Calendar, Settings } from "lucide-react-native"

const Tab = createBottomTabNavigator()

const Dashboard = () => (
  <ScrollView style={styles.container}>
    <View style={styles.section}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Balance</Text>
        <Text style={styles.balance}>$2,450.00</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Month</Text>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Income</Text>
            <Text style={styles.income}>$3,200.00</Text>
          </View>
          <View>
            <Text style={styles.label}>Expenses</Text>
            <Text style={styles.expense}>$750.00</Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Expense Trend</Text>
        <LineChart
          data={{
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [{ data: [650, 700, 800, 750, 850, 750] }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          }}
          bezier
          style={styles.chart}
        />
      </View>
    </View>
  </ScrollView>
)

const AddExpense = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Add Transaction</Text>
    <View style={styles.card}>
      <Text style={styles.label}>Amount</Text>
      <View style={styles.input}>
        <Text style={styles.inputText}>$0.00</Text>
      </View>
      <Text style={styles.label}>Category</Text>
      <View style={styles.input}>
        <Text>Select Category</Text>
      </View>
      <Text style={styles.label}>Date</Text>
      <View style={styles.input}>
        <Text>Select Date</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Add Transaction</Text>
      </View>
    </View>
  </View>
)

const Reports = () => (
  <ScrollView style={styles.container}>
    <View style={styles.section}>
      <Text style={styles.title}>Monthly Report</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>June 2023</Text>
        <PieChart
          data={[
            {
              name: "Food",
              population: 300,
              color: "rgba(131, 167, 234, 1)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
            { name: "Transport", population: 200, color: "#F00", legendFontColor: "#7F7F7F", legendFontSize: 15 },
            {
              name: "Shopping",
              population: 150,
              color: "rgb(0, 0, 255)",
              legendFontColor: "#7F7F7F",
              legendFontSize: 15,
            },
            { name: "Bills", population: 100, color: "rgb(0, 255, 0)", legendFontColor: "#7F7F7F", legendFontSize: 15 },
          ]}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top Expenses</Text>
        <View style={styles.row}>
          <Text>Food</Text>
          <Text style={styles.bold}>$300.00</Text>
        </View>
        <View style={styles.row}>
          <Text>Transport</Text>
          <Text style={styles.bold}>$200.00</Text>
        </View>
        <View style={styles.row}>
          <Text>Shopping</Text>
          <Text style={styles.bold}>$150.00</Text>
        </View>
      </View>
    </View>
  </ScrollView>
)

const SettingsScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Settings</Text>
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Profile</Text>
      <View style={styles.settingsItem}>
        <Text>Edit Personal Information</Text>
      </View>
      <Text style={styles.cardTitle}>Preferences</Text>
      <View style={styles.settingsItem}>
        <Text>Currency</Text>
      </View>
      <View style={styles.settingsItem}>
        <Text>Categories</Text>
      </View>
      <Text style={styles.cardTitle}>Notifications</Text>
      <View style={styles.settingsItem}>
        <Text>Manage Notifications</Text>
      </View>
      <Text style={styles.cardTitle}>Security</Text>
      <View style={styles.settingsItem}>
        <Text>Change Password</Text>
      </View>
    </View>
  </View>
)

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => <PieChartIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddExpense}
          options={{
            tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Reports"
          component={Reports}
          options={{
            tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  section: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "white",
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  balance: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#666",
    marginBottom: 4,
  },
  income: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  expense: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F44336",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  inputText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 4,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  settingsItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    marginBottom: 8,
  },
})

