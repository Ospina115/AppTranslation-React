import { generateId } from '../utils/helpers';

/**
 * Servicio de chatbot para conversaciones en inglés.
 *
 * NOTA PARA PRODUCCIÓN: Reemplazar las respuestas simuladas con llamadas
 * a la API de OpenAI (GPT-4) o similar para obtener respuestas reales
 * de conversación en inglés.
 *
 * Configuración necesaria:
 * - OPENAI_API_KEY en variables de entorno
 * - Endpoint: https://api.openai.com/v1/chat/completions
 */

const SYSTEM_PROMPTS = {
  general: `You are a friendly English pronunciation coach for Spanish-speaking students. 
    Your role is to:
    1. Have natural conversations in English
    2. Gently correct pronunciation mistakes
    3. Provide encouragement and tips
    4. Keep responses short and clear (2-3 sentences max)
    5. Occasionally suggest phrases to practice
    Always respond in English, but provide Spanish translations in parentheses when introducing new vocabulary.`,

  greetings: `You are practicing greetings and introductions with a Spanish-speaking student.
    Focus on: formal vs informal greetings, introductions, and farewells.
    Keep conversations friendly and educational.`,

  food: `You are a waiter in an English restaurant helping a student practice ordering food.
    Use restaurant vocabulary and help the student practice ordering, asking questions about the menu, and making requests.`,

  travel: `You are a helpful airport assistant helping a student practice travel English.
    Focus on: checking in, going through security, asking for directions, and making travel arrangements.`,

  debate: `You are a debate partner helping an advanced student practice expressing opinions in English.
    Engage in thoughtful discussions on various topics, challenging the student to use complex vocabulary and structures.`,
};

// Respuestas simuladas por contexto para la demo
const SIMULATED_RESPONSES = {
  greeting: [
    "Hello! Great to meet you! How are you feeling today? (¡Hola! ¡Encantado de conocerte! ¿Cómo te sientes hoy?)",
    "Hi there! Welcome to our English practice session! What would you like to talk about today? (¡Hola! ¡Bienvenido a nuestra sesión de práctica de inglés!)",
    "Good morning! I'm your English practice partner. Let's have a wonderful conversation! (¡Buenos días! Soy tu compañero de práctica de inglés.)",
  ],
  encouragement: [
    "Excellent pronunciation! You're doing really well! Keep it up! 🌟 (¡Excelente pronunciación! ¡Lo estás haciendo muy bien!)",
    "Very good! Your English is improving every day! (¡Muy bien! Tu inglés mejora cada día.)",
    "Great effort! Remember, practice makes perfect! 💪 (¡Gran esfuerzo! Recuerda, la práctica hace al maestro.)",
  ],
  correction: [
    "That was good! Try to emphasize the word a bit more. (¡Estuvo bien! Intenta enfatizar más la palabra.)",
    "Nice try! Pay attention to the 'th' sound in English - put your tongue between your teeth. (¡Buen intento! Presta atención al sonido 'th'.)",
    "Good attempt! Remember to connect the words smoothly when speaking. (¡Buen intento! Recuerda conectar las palabras suavemente.)",
  ],
  question: [
    "Can you tell me more about yourself? What do you like to do in your free time? (¿Puedes contarme más sobre ti? ¿Qué te gusta hacer en tu tiempo libre?)",
    "Interesting! What do you think about learning English? Is it important for your future? (¡Interesante! ¿Qué piensas sobre aprender inglés?)",
    "That's great! Have you ever traveled to an English-speaking country? (¡Genial! ¿Alguna vez has viajado a un país de habla inglesa?)",
  ],
  farewell: [
    "It was wonderful practicing with you today! See you next time! 👋 (¡Fue maravilloso practicar contigo hoy! ¡Hasta la próxima!)",
    "Great conversation! You're making amazing progress! Goodbye for now! (¡Gran conversación! ¡Estás haciendo un progreso increíble!)",
    "Thanks for the practice session! Keep speaking English every day! (¡Gracias por la sesión de práctica! ¡Sigue hablando inglés todos los días!)",
  ],
};

/**
 * Genera una respuesta del chatbot.
 * En producción, reemplazar con llamada a OpenAI API.
 */
async function getChatbotResponse(userMessage, conversationHistory = [], topicContext = 'general') {
  // Simulación de delay de red
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

  const message = userMessage.toLowerCase();

  // Lógica simple de contexto para la simulación
  let responseCategory = 'question';

  if (message.length < 5) {
    responseCategory = 'encouragement';
  } else if (
    message.includes('hello') ||
    message.includes('hi') ||
    message.includes('good morning') ||
    message.includes('hey')
  ) {
    responseCategory = 'greeting';
  } else if (
    message.includes('bye') ||
    message.includes('goodbye') ||
    message.includes('see you')
  ) {
    responseCategory = 'farewell';
  } else if (
    message.includes('help') ||
    message.includes('how') ||
    message.includes('what') ||
    message.includes('where')
  ) {
    responseCategory = 'question';
  } else if (conversationHistory.length % 3 === 0) {
    responseCategory = 'encouragement';
  }

  const responses = SIMULATED_RESPONSES[responseCategory];
  const response = responses[Math.floor(Math.random() * responses.length)];

  return {
    id: generateId(),
    text: response,
    isBot: true,
    timestamp: new Date().toISOString(),
    topicContext,
  };

  /* 
   * IMPLEMENTACIÓN REAL CON OPENAI (descomentar para producción):
   *
   * const response = await fetch('https://api.openai.com/v1/chat/completions', {
   *   method: 'POST',
   *   headers: {
   *     'Content-Type': 'application/json',
   *     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
   *   },
   *   body: JSON.stringify({
   *     model: 'gpt-4',
   *     messages: [
   *       { role: 'system', content: SYSTEM_PROMPTS[topicContext] || SYSTEM_PROMPTS.general },
   *       ...conversationHistory.map(msg => ({
   *         role: msg.isBot ? 'assistant' : 'user',
   *         content: msg.text,
   *       })),
   *       { role: 'user', content: userMessage },
   *     ],
   *     max_tokens: 150,
   *     temperature: 0.7,
   *   }),
   * });
   * const data = await response.json();
   * return {
   *   id: generateId(),
   *   text: data.choices[0].message.content,
   *   isBot: true,
   *   timestamp: new Date().toISOString(),
   * };
   */
}

/**
 * Crea un mensaje del usuario.
 */
function createUserMessage(text) {
  return {
    id: generateId(),
    text,
    isBot: false,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Mensaje de bienvenida del chatbot.
 */
function getWelcomeMessage(topicContext = 'general') {
  const welcomes = {
    general: "Hello! I'm your English practice partner. Let's have a great conversation! What would you like to talk about today? (¡Hola! Soy tu compañero de práctica de inglés. ¿De qué te gustaría hablar hoy?)",
    greetings: "Hi! Let's practice greetings and introductions today. Start by introducing yourself! (¡Hola! Practiquemos saludos e introducciones hoy. ¡Comienza presentándote!)",
    food: "Welcome to our English restaurant! I'm your waiter today. Can I start you off with something to drink? (¡Bienvenido a nuestro restaurante inglés! Soy tu mesero hoy.)",
    travel: "Hello, traveler! Welcome to the airport. How can I assist you today? (¡Hola, viajero! Bienvenido al aeropuerto. ¿En qué puedo ayudarte hoy?)",
    debate: "Hello! I'm ready to discuss any topic with you in English. What would you like to debate today? (¡Hola! Estoy listo para discutir cualquier tema contigo en inglés.)",
  };

  return {
    id: generateId(),
    text: welcomes[topicContext] || welcomes.general,
    isBot: true,
    timestamp: new Date().toISOString(),
  };
}

const aiService = {
  getChatbotResponse,
  createUserMessage,
  getWelcomeMessage,
  SYSTEM_PROMPTS,
};

export default aiService;
