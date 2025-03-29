"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useTransactions } from "../context/TransactionContext"
import { theme } from "../theme"
import { useCurrency } from "../hooks/useCurrency"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"

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
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferencias</Text>

        <TouchableOpacity style={styles.settingsItem} onPress={toggleCurrency}>
          <Text style={styles.settingsText}>Moneda</Text>
          <View style={styles.currencySelector}>
            <Text style={[styles.currencyOption, currency === "USD" && styles.activeCurrency]}>USD</Text>
            <Text style={styles.currencySeparator}>|</Text>
            <Text style={[styles.currencyOption, currency === "COP" && styles.activeCurrency]}>COP</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.settingsItem}>
          <Text style={styles.settingsText}>Notificaciones</Text>
          <Switch
            value={notifications}
            onValueChange={toggleNotifications}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>

        <View style={styles.settingsItem}>
          <Text style={styles.settingsText}>Modo Oscuro</Text>
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Datos</Text>

        <TouchableOpacity style={styles.settingsItem} onPress={exportData}>
          <Text style={styles.settingsText}>Exportar Datos</Text>
          <Text style={styles.actionText}>Exportar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem} onPress={clearAllData}>
          <Text style={styles.dangerText}>Borrar Todos los Datos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Acerca de</Text>

        <View style={styles.settingsItem}>
          <Text style={styles.settingsText}>Versión</Text>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>

        <View style={[styles.settingsItem, styles.noBorder]}>
  <Text style={styles.settingsText}>Desarrollado por</Text>
  <Text style={styles.developerText}>
    Felipe Beltran Assaf{"\n"}
    Sebastian Martinez Pabon
  </Text>
</View>


      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  sectionTitle: {
    fontSize: theme.fontSizes.large,
    fontWeight: "bold",
    color: theme.colors.text,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingsText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  actionText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  dangerText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.danger,
    fontWeight: "500",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyOption: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
    paddingHorizontal: 8,
  },
  activeCurrency: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  currencySeparator: {
    color: theme.colors.border,
  },
  versionText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.textSecondary,
  },
  developerText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.primary,
  },
})

export default SettingsScreen

