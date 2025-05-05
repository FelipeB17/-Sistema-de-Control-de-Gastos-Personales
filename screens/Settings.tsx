"use client"
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from "react-native"
import { useTransactions } from "../context/TransactionContext"
import { useTheme } from "../context/ThemeContext"
import { useCurrency } from "../hooks/useCurrency"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { DollarSign, Moon, FileDown, Trash2, Info, ChevronRight, Code } from "lucide-react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const SettingsScreen = () => {
  const { transactions, clearTransactions } = useTransactions()
  const { currency, changeCurrency, convert } = useCurrency()
  const { isDarkMode, toggleTheme, theme } = useTheme()

  const toggleCurrency = async () => {
    const newCurrency = currency === "USD" ? "COP" : "USD"
    await changeCurrency(newCurrency)
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.primary }]} edges={["top"]}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>Configuración</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Preferencias</Text>

            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <TouchableOpacity
                style={[styles.settingsItem, { borderBottomColor: theme.colors.border }]}
                onPress={toggleCurrency}
              >
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  <DollarSign color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Moneda</Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    {currency === "USD" ? "Dólares (USD)" : "Pesos Colombianos (COP)"}
                  </Text>
                </View>
                <View style={[styles.currencySelector, { backgroundColor: theme.colors.primaryLight }]}>
                  <Text style={[styles.currencyOption, currency === "USD" && styles.activeCurrency]}>USD</Text>
                  <Text style={[styles.currencySeparator, { color: theme.colors.border }]}>|</Text>
                  <Text style={[styles.currencyOption, currency === "COP" && styles.activeCurrency]}>COP</Text>
                </View>
              </TouchableOpacity>

              <View style={[styles.settingsItem, { borderBottomColor: theme.colors.border }]}>
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  <Moon color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Modo Oscuro</Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    {isDarkMode ? "Activado" : "Desactivado"}
                  </Text>
                </View>
                <Switch
                  value={isDarkMode}
                  onValueChange={toggleTheme}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Datos</Text>

            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <TouchableOpacity
                style={[styles.settingsItem, { borderBottomColor: theme.colors.border }]}
                onPress={exportData}
              >
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  <FileDown color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Exportar Datos</Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    Guarda tus datos en un archivo
                  </Text>
                </View>
                <ChevronRight color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingsItem} onPress={clearAllData}>
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.dangerLight }]}>
                  <Trash2 color={theme.colors.danger} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.dangerText, { color: theme.colors.danger }]}>Borrar Todos los Datos</Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    Elimina todas tus transacciones
                  </Text>
                </View>
                <ChevronRight color={theme.colors.textSecondary} size={20} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Acerca de</Text>

            <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
              <View style={[styles.settingsItem, { borderBottomColor: theme.colors.border }]}>
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  <Code color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Desarrolladores</Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                    Felipe Beltran Assaf{"\n"}
                    Sebastian Martinez Pabon
                  </Text>
                </View>
              </View>

              <View style={styles.settingsItem}>
                <View style={[styles.settingIconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                  <Info color={theme.colors.primary} size={20} />
                </View>
                <View style={styles.settingTextContainer}>
                  <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Versión</Text>
                  <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>1.0.0</Text>
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
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
    marginTop: -20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 8,
  },
  card: {
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
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  currencyOption: {
    fontSize: 12,
    color: "#718096",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeCurrency: {
    color: "#4361EE",
    fontWeight: "bold",
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  currencySeparator: {
    color: "#E2E8F0",
  },
})

export default SettingsScreen
