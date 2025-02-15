import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { theme } from "../theme"

const SettingsScreen = () => {
  const clearAllData = async () => {
    Alert.alert("Clear All Data", "Are you sure you want to clear all data? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          try {
            await AsyncStorage.clear()
            Alert.alert("Success", "All data has been cleared.")
          } catch (e) {
            Alert.alert("Error", "Failed to clear data.")
          }
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>Notification Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>Currency Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsText}>Export Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={clearAllData}>
          <Text style={styles.dangerText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingsText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.text,
  },
  dangerText: {
    fontSize: theme.fontSizes.medium,
    color: theme.colors.danger,
  },
})

export default SettingsScreen

