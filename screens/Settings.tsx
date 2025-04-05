"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { DollarSign, Bell, Moon, FileDown, Trash2, Info, ChevronRight, Code } from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SettingsScreen = () => {
  const { transactions, clearTransactions } = useTransactions()
  const { currency, changeCurrency } = useCurrency()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const savedNotifications = await AsyncStorage.getItem("@notifications")
      if (savedNotifications) setNotifications(JSON.parse(savedNotifications))

      const savedDarkMode = await AsyncStorage.getItem("@darkMode")
      if (savedDarkMode) setDarkMode(JSON.parse(savedDarkMode))
    } catch (e) {
      console.error("Failed to load settings", e)
    }
  }

  const saveSetting = async (key: string, value: string | boolean) => {
    try {
      await AsyncStorage.setItem(`@${key}`, typeof value === "string" ? value : JSON.stringify(value))
    } catch (e) {
      console.error(`Failed to save ${key}`, e)
    }
  }

  const toggleCurrency = async () => {
    const newCurrency = currency === "USD" ? "COP" : "USD"
    await changeCurrency(newCurrency)
  }

  const toggleNotifications = async () => {
    setNotifications(!notifications)
    await saveSetting("notifications", !notifications)
  }

  const toggleDarkMode = async () => {
    setDarkMode(!darkMode)
    await saveSetting("darkMode", !darkMode)
    // Here you would implement the actual theme change
  }

  const clearAllData = async () => {
    Alert.alert(
      "Borrar Todos los Datos",
      "¿Estás seguro que deseas borrar todos los datos? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              await clearTransactions()
              Alert.alert("Éxito", "Todos los datos han sido borrados.")
            } catch (e) {
              Alert.alert("Error", "No se pudieron borrar los datos.")
            }
          },
        },
      ],
    )
  }

  const exportData = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Error", "El compartir no está disponible en este dispositivo")
        return
      }

      const data = JSON.stringify(transactions, null, 2)
      const fileUri = FileSystem.documentDirectory + "expense_tracker_data.json"

      await FileSystem.writeAsStringAsync(fileUri, data)
      await Sharing.shareAsync(fileUri)
    } catch (error) {
      console.error("Error exporting data:", error)
      Alert.alert("Error", "No se pudieron exportar los datos")
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configuración</Text>
        </View>
        
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferencias</Text>

            <View style={styles.card}>
              <TouchableOpacity style={styles.settingsItem} onPress={toggleCurrency}>
                <View style={styles.settingIconContainer}>
                  <DollarSign color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Moneda</Text>
                  <Text style={styles.settingDescription}>Cambia la moneda de la aplicación</Text>
                </View>
                <View style={styles.currencySelector}>
                  <Text style={[styles.currencyOption, currency === "USD" && styles.activeCurrency]}>USD</Text>
                  <Text style={styles.currencySeparator}>|</Text>
                  <Text style={[styles.currencyOption, currency === "COP" && styles.activeCurrency]}>COP</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Bell color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Notificaciones</Text>
                  <Text style={styles.settingDescription}>Recibe alertas sobre tus gastos</Text>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={toggleNotifications}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={notifications ? "#fff" : "#f4f3f4"}
                />
              </View>

              <View style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Moon color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Modo Oscuro</Text>
                  <Text style={styles.settingDescription}>Cambia el tema de la aplicación</Text>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={darkMode ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos</Text>

            <View style={styles.card}>
              <TouchableOpacity style={styles.settingsItem} onPress={exportData}>
                <View style={styles.settingIconContainer}>
                  <FileDown color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Exportar Datos</Text>
                  <Text style={styles.settingDescription}>Guarda tus datos en un archivo</Text>
                </View>
                <ChevronRight color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem} onPress={clearAllData}>
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.dangerLight }]}>
                  <Trash2 color={theme.colors.danger} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.dangerText}>Borrar Todos los Datos</Text>
                  <Text style={styles.settingDescription}>Elimina todas tus transacciones</Text>
                </View>
                <ChevronRight color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Acerca de</Text>

            <View style={styles.card}>
              <View style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Code color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Desarrolladores</Text>
                  <Text style={styles.settingDescription}>
                    Felipe Beltran Assaf{"\n"}
                    Sebastian Martinez Pabon
                  </Text>
                </View>
              </View>

              <View style={styles.settingsItem}>
                <View style={styles.settingIconContainer}>
                  <Info color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingLabel}>Versión</Text>
                  <Text style={styles.settingDescription}>1.0.0</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
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
    paddingBottom: 50,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
  },
  spacer: {
    height: 30,
    backgroundColor: "transparent",
  },
  content: {
    padding: 16,
    marginTop: 0,
  },
  section: {
    marginBottom: 24,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.medium,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 12,
    marginLeft: 8,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  dangerText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.danger,
    fontWeight: "500",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currencyOption: {
    fontSize: theme.fontSizes.small,
    color: theme.colors.textSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeCurrency: {
    color: theme.colors.primary,
    fontWeight: "bold",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  currencySeparator: {
    color: theme.colors.border,
  },
})

export default SettingsScreen

