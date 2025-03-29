// Función placeholder para cuando decidas implementar notificaciones
export async function registerForPushNotificationsAsync() {
  console.log("Notificaciones no implementadas aún")
  return null
}

// Cuando estés listo para implementar notificaciones, descomenta este código
// e instala expo-notifications:

/*
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"

export async function registerForPushNotificationsAsync() {
  let token

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!")
    return
  }

  token = (await Notifications.getExpoPushTokenAsync()).data

  return token
}
*/

