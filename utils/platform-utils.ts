import { Platform, Dimensions, StatusBar } from "react-native"

export const isIOS = Platform.OS === "ios"
export const isAndroid = Platform.OS === "android"

// Obtener dimensiones seguras considerando notch y otros elementos de UI
export const getStatusBarHeight = () => {
  return isIOS ? 20 : StatusBar.currentHeight || 0
}

export const getScreenDimensions = () => {
  return {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  }
}

// Estilos específicos por plataforma
export const platformStyles = {
  shadow: isIOS
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      }
    : {
        elevation: 3,
      },
}

