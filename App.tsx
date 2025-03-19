import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { PieChart as PieChartIcon, PlusCircle, Calendar, Settings } from "lucide-react-native"

import Dashboard from "./screens/Dashboard"
import AddExpense from "./screens/AddExpense"
import Reports from "./screens/Reports"
import SettingsScreen from "./screens/Settings"
import { TransactionProvider } from "./context/TransactionContext"
import { theme } from "./theme" 

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <TransactionProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let icon
              if (route.name === "Dashboard") {
                icon = <PieChartIcon color={color} size={size} />
              } else if (route.name === "Add") {
                icon = <PlusCircle color={color} size={size} />
              } else if (route.name === "Reports") {
                icon = <Calendar color={color} size={size} />
              } else if (route.name === "Settings") {
                icon = <Settings color={color} size={size} />
              }
              return icon
            },
            tabBarActiveTintColor: theme.colors.primary,
            tabBarInactiveTintColor: theme.colors.textSecondary,
            tabBarStyle: {
              backgroundColor: theme.colors.card,
              borderTopColor: theme.colors.border,
            },
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTintColor: theme.colors.card,
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        >
          <Tab.Screen name="Dashboard" component={Dashboard} />
          <Tab.Screen name="Add" component={AddExpense} />
          <Tab.Screen name="Reports" component={Reports} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </TransactionProvider>
  )
}

