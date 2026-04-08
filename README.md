# 🎤 SpeakUp – AppTranslation React Native

> Aplicación móvil educativa para mejorar la pronunciación en inglés mediante inteligencia artificial, similar a Duolingo. Diseñada para estudiantes de colegio, con administración de usuarios y seguimiento de progreso.

---

## 📱 Características principales

| Característica | Descripción |
|---|---|
| 🎙️ Reconocimiento de voz | Evalúa la pronunciación del estudiante en tiempo real |
| 🤖 Chatbot IA | Conversaciones en inglés con un asistente inteligente |
| 📚 Sesiones por temas | 10 temas organizados por dificultad (Principiante / Intermedio / Avanzado) |
| 🔐 Autenticación | Registro e inicio de sesión de estudiantes |
| 👨‍💼 Panel de administración | El admin visualiza el progreso de cada estudiante |
| 📊 Seguimiento de progreso | Puntos, niveles, racha diaria, historial de ejercicios |
| 🔓 Desbloqueo progresivo | Los temas intermedios y avanzados se desbloquean gradualmente |

---

## 🏗️ Arquitectura del proyecto

```
AppTranslation-React/
├── App.js                          # Punto de entrada
├── app.json                        # Configuración de Expo
├── package.json                    # Dependencias
├── babel.config.js
├── assets/                         # Imágenes, íconos, splash screen
└── src/
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.js      # Inicio de sesión
    │   │   └── RegisterScreen.js   # Registro de estudiantes
    │   ├── student/
    │   │   ├── HomeScreen.js       # Pantalla principal del estudiante
    │   │   ├── TopicsScreen.js     # Lista de temas disponibles
    │   │   ├── LessonScreen.js     # Pantalla de ejercicios
    │   │   ├── ChatbotScreen.js    # Chat con IA
    │   │   ├── ProgressScreen.js   # Mi progreso
    │   │   └── ProfileScreen.js    # Perfil y configuración
    │   └── admin/
    │       ├── AdminDashboard.js   # Panel principal del admin
    │       ├── StudentsListScreen.js # Lista de estudiantes
    │       └── StudentDetailScreen.js # Detalle de progreso de un estudiante
    ├── components/
    │   ├── common/
    │   │   ├── Button.js           # Botón reutilizable (variantes)
    │   │   ├── Card.js             # Tarjeta con sombra
    │   │   └── ProgressBar.js      # Barra de progreso
    │   ├── voice/
    │   │   ├── VoiceRecorder.js    # Grabación y análisis de voz
    │   │   └── PronunciationFeedback.js # Retroalimentación de pronunciación
    │   └── chat/
    │       ├── ChatMessage.js      # Burbuja de mensaje del chat
    │       └── ChatInput.js        # Campo de entrada del chat
    ├── navigation/
    │   ├── AppNavigator.js         # Navegador raíz (auth/student/admin)
    │   ├── AuthNavigator.js        # Stack de autenticación
    │   ├── StudentNavigator.js     # Tab navigator del estudiante
    │   └── AdminNavigator.js       # Stack del administrador
    ├── context/
    │   ├── AuthContext.js          # Estado de autenticación global
    │   └── AppContext.js           # Estado de progreso global
    ├── services/
    │   ├── authService.js          # Registro, login, sesiones
    │   ├── progressService.js      # CRUD de progreso del usuario
    │   ├── voiceService.js         # TTS, grabación, evaluación de voz
    │   └── aiService.js            # Chatbot IA (simulado / OpenAI)
    ├── data/
    │   ├── topics.js               # Definición de 10 temas
    │   └── exercises.js            # Ejercicios por tema y lección
    └── utils/
        ├── constants.js            # Colores, fuentes, rutas, constantes
        └── helpers.js              # Funciones utilitarias
```

---

## 🚀 Guía de instalación y desarrollo

### Prerrequisitos

- Node.js ≥ 18 ([https://nodejs.org](https://nodejs.org))
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Para iOS: macOS con Xcode ≥ 14
- Para Android: Android Studio con un AVD configurado
- Expo Go (app móvil) para pruebas rápidas en dispositivo físico

### Paso 1 – Clonar el repositorio

```bash
git clone https://github.com/Ospina115/AppTranslation-React.git
cd AppTranslation-React
```

### Paso 2 – Instalar dependencias

```bash
npm install
```

### Paso 3 – Iniciar el servidor de desarrollo

```bash
npx expo start
```

Escaneá el código QR con **Expo Go** en tu teléfono, o presioná:
- `a` → Android emulator
- `i` → iOS simulator
- `w` → navegador web

---

## 🔑 Credenciales por defecto

| Rol | Email | Contraseña |
|---|---|---|
| 👨‍💼 Administrador | `admin@apptranslation.edu` | `Admin123!` |
| 👨‍🎓 Estudiante | Registrate con cualquier correo | Tu contraseña elegida |

---

## 🧩 Temas disponibles

| # | Tema | Dificultad | Lecciones |
|---|---|---|---|
| 1 | 👋 Saludos y Presentaciones | Principiante | 5 |
| 2 | 🔢 Números y Cantidades | Principiante | 4 |
| 3 | 🎨 Colores y Descripción | Principiante | 4 |
| 4 | 👨‍👩‍👧‍👦 Familia y Relaciones | Principiante | 5 |
| 5 | 🍽️ Comida y Restaurante | Intermedio | 6 |
| 6 | ✈️ Viajes y Transporte | Intermedio | 6 |
| 7 | 💼 Trabajo y Profesiones | Intermedio | 7 |
| 8 | 🏥 Salud y Cuerpo | Intermedio | 6 |
| 9 | 🗣️ Debate y Opinión | Avanzado | 8 |
| 10 | 📊 Inglés de Negocios | Avanzado | 8 |

> Los temas intermedios se desbloquean al completar todos los de nivel principiante.
> Los temas avanzados se desbloquean al completar todos los intermedios.

---

## 🤖 Integración con IA

### Estado actual (MVP / Demo)

El servicio `aiService.js` incluye respuestas simuladas para demostración sin necesidad de API key.

El servicio `voiceService.js` simula el reconocimiento de voz con variación aleatoria para demostración.

### Integración real con OpenAI (producción)

1. Crea una cuenta en [platform.openai.com](https://platform.openai.com)
2. Obtén tu API key
3. Crea un archivo `.env` en la raíz del proyecto:

```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx
```

4. En `src/services/aiService.js`, descomenta el bloque `IMPLEMENTACIÓN REAL CON OPENAI` y comenta la simulación.

### Integración con Google Cloud Speech-to-Text (producción)

1. Habilita la Speech-to-Text API en [Google Cloud Console](https://console.cloud.google.com)
2. Descarga las credenciales JSON
3. En `src/services/voiceService.js`, reemplaza la función `recognizeSpeech` para enviar el audio al endpoint de Google.

### Alternativa: OpenAI Whisper (más sencillo)

```javascript
// En voiceService.js → recognizeSpeech()
const formData = new FormData();
formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'recording.m4a' });
formData.append('model', 'whisper-1');
formData.append('language', 'en');

const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
  body: formData,
});
const data = await response.json();
```

---

## 🗄️ Backend para producción

### Opción A – Firebase (recomendado)

```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

Estructura sugerida en Firestore:
```
/users/{userId}
  - name, email, role, createdAt
/progress/{userId}
  - totalPoints, streak, completedLessons, exerciseHistory, topicsProgress
```

### Opción B – Supabase

```bash
npm install @supabase/supabase-js
```

### Opción C – API REST propia

Crear un backend en Node.js/Express o Django con endpoints:
- `POST /auth/register`
- `POST /auth/login`
- `GET/PUT /progress/:userId`
- `GET /admin/students`

---

## 📲 Construcción para producción

### Android (APK / AAB)

```bash
npx expo build:android
# o con EAS Build (recomendado):
npx eas build --platform android
```

### iOS (IPA)

```bash
npx expo build:ios
# o:
npx eas build --platform ios
```

### Configurar EAS Build

```bash
npm install -g eas-cli
eas login
eas build:configure
```

---

## 🧪 Tests

```bash
npm test
```

Los tests usan Jest con `jest-expo`.

---

## 🗺️ Roadmap – Próximas funcionalidades

- [ ] Notificaciones push para recordatorios de práctica diaria
- [ ] Modo offline con sincronización al reconectar
- [ ] Ejercicios de tipo "fill in the blank" interactivos
- [ ] Análisis de pronunciación fonema por fonema
- [ ] Tabla de clasificación entre estudiantes de la misma clase
- [ ] Exportación de reportes en PDF para profesores
- [ ] Soporte para múltiples idiomas (francés, alemán, etc.)
- [ ] Modo de clase grupal en tiempo real
- [ ] Integración con Google Classroom

---

## 🔧 Solución de problemas frecuentes

### Error: "Expo module not found"
```bash
npx expo install --fix
```

### Micrófono no funciona en iOS Simulator
El simulador de iOS no soporta el micrófono. Usa un dispositivo físico o el simulador de Android.

### Error de metro bundler
```bash
npx expo start --clear
```

### "Unable to resolve module"
```bash
rm -rf node_modules
npm install
```

---

## 📁 Variables de entorno

Crea un archivo `.env` en la raíz (no lo subas al repositorio):

```env
# IA - OpenAI
OPENAI_API_KEY=sk-...

# Firebase (si se usa)
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...

# Supabase (alternativa)
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=...
```

Para usar variables de entorno en Expo, instala:
```bash
npx expo install expo-constants
```
Y coloca las variables en `app.json` bajo `extra:`.

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz tus cambios y añade tests si aplica
4. Envía un Pull Request describiendo los cambios

---

## 📄 Licencia

MIT License – Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Desarrollado por

**Ospina115** – AppTranslation React Native
Aplicación educativa para mejorar el inglés mediante IA para estudiantes de colegio.
