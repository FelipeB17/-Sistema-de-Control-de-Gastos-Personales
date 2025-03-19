import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { PieChart as PieChartIcon, PlusCircle, Calendar, Settings as SettingsIcon } from "lucide-react-native"

import Dashboard from "./screens/Dashboard"
import AddExpense from "./screens/AddExpense"
import Reports from "./screens/Reports"
import SettingsScreen from "./screens/Settings"
import { TransactionProvider } from "./context/TransactionContext"
import { theme } from "./theme"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

const Tab = createBottomTabNavigator()

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <TransactionProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                let icon
                if (route.name === "Dashboard") {
                  icon = <PieChartIcon color={color} size={size} />
                } else if (route.name === "Agregar") {
                  icon = <PlusCircle color={color} size={size} />
                } else if (route.name === "Reportes") {
                  icon = <Calendar color={color} size={size} />
                } else if (route.name === "Ajustes") {
                  icon = <SettingsIcon color={color} size={size} />
                }
                return icon
              },
              tabBarActiveTintColor: theme.colors.primary,
              tabBarInactiveTintColor: theme.colors.textSecondary,
              tabBarStyle: {
                backgroundColor: theme.colors.card,
                borderTopColor: theme.colors.border,
                paddingBottom: 5,
                height: 60,
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
            <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: "Inicio" }} />
            <Tab.Screen name="Agregar" component={AddExpense} options={{ title: "Agregar Transacción" }} />
            <Tab.Screen name="Reportes" component={Reports} options={{ title: "Reportes" }} />
            <Tab.Screen name="Ajustes" component={SettingsScreen} options={{ title: "Ajustes" }} />
          </Tab.Navigator>
        </NavigationContainer>
      </TransactionProvider>
    </SafeAreaProvider>
  )
}

