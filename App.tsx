"use client"

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { PieChart as PieChartIcon, PlusCircle, Calendar, Settings as SettingsIcon } from "lucide-react-native"

import Dashboard from "./screens/Dashboard"
import AddExpense from "./screens/AddExpense"
import Reports from "./screens/Reports"
import SettingsScreen from "./screens/Settings"
import { TransactionProvider } from "./context/TransactionContext"
import { ThemeProvider, useTheme } from "./context/ThemeContext"
import { CurrencyProvider } from "./hooks/useCurrency"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

const Tab = createBottomTabNavigator()

function MainApp() {
  const { theme, isDarkMode } = useTheme()

  return (
    <SafeAreaProvider>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <TransactionProvider>
        <CurrencyProvider>
          <NavigationContainer
            theme={{
              dark: isDarkMode,
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.background,
                card: theme.colors.card,
                text: theme.colors.text,
                border: theme.colors.border,
                notification: theme.colors.primary,
              },
            }}
          >
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
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                },
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                headerTintColor: theme.colors.card,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                tabBarLabelStyle: {
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 4,
                },
              })}
            >
              <Tab.Screen name="Dashboard" component={Dashboard} options={{ title: "Inicio", headerShown: false }} />
              <Tab.Screen name="Agregar" component={AddExpense} options={{ title: "Agregar", headerShown: false }} />
              <Tab.Screen name="Reportes" component={Reports} options={{ title: "Reportes", headerShown: false }} />
              <Tab.Screen
                name="Ajustes"
                component={SettingsScreen}
                options={{ title: "Ajustes", headerShown: false }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </CurrencyProvider>
      </TransactionProvider>
    </SafeAreaProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  )
}
