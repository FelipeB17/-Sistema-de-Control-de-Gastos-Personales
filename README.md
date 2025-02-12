Sistema de Gestión de Gastos Personales

Expense Tracker es una aplicación desarrollada con React Native y Expo que permite la administración eficiente de gastos mediante una interfaz intuitiva y accesible.

Instalación de Herramientas

Antes de iniciar, asegúrate de tener instalados Node.js y npm. Luego, instala Expo CLI de manera global ejecutando el siguiente comando:

npm install -g expo-cli

Creación del Proyecto

Para generar un nuevo proyecto en Expo con soporte para TypeScript, ejecuta los siguientes comandos:

npx create-expo-app -t expo-template-blank-typescript expense-tracker
cd expense-tracker

Instalación de Dependencias

Ejecuta los siguientes comandos para integrar las dependencias esenciales del proyecto:

npx expo install react-native-svg @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens
npm install react-native-chart-kit lucide-react-native
npx expo install @react-native-async-storage/async-storage

Configuración del Código

Sustituye el contenido de App.tsx con el código base del proyecto.

Ajustes Técnicos

Si se presentan errores de compatibilidad con los estilos en React Native:

Utiliza style en lugar de className.

Define los estilos mediante StyleSheet.create() para optimizar el rendimiento.

Verifica la nomenclatura de los componentes para evitar conflictos.

Ejecución de la Aplicación

Para iniciar el servidor de desarrollo de Expo, ejecuta el siguiente comando:

npx expo start

Esto habilitará Expo Developer Tools en el navegador, permitiéndote probar la aplicación en un emulador o dispositivo físico.

Contribuciones

Las contribuciones al proyecto son bienvenidas. Si deseas colaborar, abre un issue o envía un pull request.

Licencia

Este proyecto está bajo la licencia MIT. Para más detalles, consulta el archivo LICENSE.
