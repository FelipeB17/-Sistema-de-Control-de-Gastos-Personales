# Sistema de Gestión de Gastos Personales

Expense Tracker es una aplicación desarrollada con React Native y Expo que permite la administración eficiente de gastos mediante una interfaz intuitiva y accesible.

## Instalación de Herramientas

Antes de iniciar, asegúrate de tener instalados [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/). Luego, instala Expo CLI de manera global ejecutando el siguiente comando:

```sh
npm install -g expo-cli
```

## Creación del Proyecto

Para generar un nuevo proyecto en Expo con soporte para TypeScript, ejecuta los siguientes comandos:

```sh
npx create-expo-app -t expo-template-blank-typescript expense-tracker
cd expense-tracker
```

## Instalación de Dependencias

Ejecuta los siguientes comandos para integrar las dependencias esenciales del proyecto:

```sh
npx expo install react-native-svg @react-navigation/native @react-navigation/bottom-tabs react-native-safe-area-context react-native-screens
npm install react-native-chart-kit lucide-react-native
npx expo install @react-native-async-storage/async-storage
```

## Configuración del Código

Sustituye el contenido de `App.tsx` con el código base del proyecto.

### Ajustes Técnicos

Si se presentan errores de compatibilidad con los estilos en React Native:

- Utiliza `style` en lugar de `className`.
- Define los estilos mediante `StyleSheet.create()` para optimizar el rendimiento.
- Verifica la nomenclatura de los componentes para evitar conflictos.

## Ejecución de la Aplicación

Para iniciar el servidor de desarrollo de Expo, ejecuta el siguiente comando:

```sh
npx expo start
```

Esto habilitará Expo Developer Tools en el navegador, permitiéndote probar la aplicación en un emulador o dispositivo físico.


