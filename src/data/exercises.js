import { EXERCISE_TYPES } from '../utils/constants';

/**
 * Base de ejercicios por tema.
 * Cada lección tiene varios ejercicios de diferentes tipos.
 */
export const EXERCISES_BY_TOPIC = {
  greetings: [
    {
      id: 'greet_l1',
      topicId: 'greetings',
      lessonNumber: 1,
      title: 'Buenos días y saludos básicos',
      exercises: [
        {
          id: 'g1_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Escucha y repite la siguiente frase:',
          phrase: 'Good morning!',
          translation: '¡Buenos días!',
          phonetic: '/ɡʊd ˈmɔːrnɪŋ/',
          tips: 'Pronuncia "Good" con la "oo" corta, como en "book".',
        },
        {
          id: 'g1_e2',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Escucha y repite:',
          phrase: 'Good afternoon!',
          translation: '¡Buenas tardes!',
          phonetic: '/ɡʊd ˌæftərˈnuːn/',
          tips: 'Enfatiza la segunda sílaba de "afternoon".',
        },
        {
          id: 'g1_e3',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Practica esta frase completa:',
          phrase: 'Good evening! How are you?',
          translation: '¡Buenas noches! ¿Cómo estás?',
          phonetic: '/ɡʊd ˈiːvnɪŋ haʊ ɑːr juː/',
          tips: 'Usa una entonación ascendente para la pregunta.',
        },
        {
          id: 'g1_e4',
          type: EXERCISE_TYPES.READ_ALOUD,
          instruction: 'Lee en voz alta la siguiente conversación:',
          phrase: "Hello! My name is Maria. Nice to meet you!",
          translation: '¡Hola! Me llamo María. ¡Encantada de conocerte!',
          phonetic: '/həˈloʊ maɪ neɪm ɪz məˈriːə naɪs tuː miːt juː/',
          tips: 'Conecta las palabras suavemente entre sí.',
        },
      ],
    },
    {
      id: 'greet_l2',
      topicId: 'greetings',
      lessonNumber: 2,
      title: 'Presentaciones formales e informales',
      exercises: [
        {
          id: 'g2_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Repite esta presentación formal:',
          phrase: 'My name is John Smith. I am pleased to meet you.',
          translation: 'Me llamo John Smith. Es un placer conocerle.',
          phonetic: '/maɪ neɪm ɪz dʒɒn smɪθ aɪ æm pliːzd tuː miːt juː/',
          tips: 'En presentaciones formales habla más despacio y claramente.',
        },
        {
          id: 'g2_e2',
          type: EXERCISE_TYPES.CONVERSATION,
          instruction: 'Practica este diálogo con el chatbot:',
          phrase: "Hi! I'm Alex. What's your name?",
          translation: '¡Hola! Soy Alex. ¿Cómo te llamas?',
          phonetic: "/haɪ aɪm ˈælɪks wɒts jɔːr neɪm/",
          tips: 'La contracción "I\'m" suena como "aim".',
        },
      ],
    },
    {
      id: 'greet_l3',
      topicId: 'greetings',
      lessonNumber: 3,
      title: 'Despedidas y expresiones de cortesía',
      exercises: [
        {
          id: 'g3_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Repite estas despedidas:',
          phrase: 'Goodbye! See you tomorrow!',
          translation: '¡Adiós! ¡Hasta mañana!',
          phonetic: '/ɡʊdˈbaɪ siː juː təˈmɒrəʊ/',
          tips: '"Goodbye" tiene el acento en la segunda sílaba.',
        },
        {
          id: 'g3_e2',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Practica expresiones de cortesía:',
          phrase: 'Thank you very much! You are welcome.',
          translation: '¡Muchas gracias! De nada.',
          phonetic: '/θæŋk juː ˈvɛri mʌtʃ juː ɑː ˈwɛlkəm/',
          tips: '"Thank" empieza con el sonido "th" dental fricativo.',
        },
      ],
    },
  ],
  numbers: [
    {
      id: 'num_l1',
      topicId: 'numbers',
      lessonNumber: 1,
      title: 'Números del 1 al 10',
      exercises: [
        {
          id: 'n1_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Repite los números del 1 al 5:',
          phrase: 'One, two, three, four, five',
          translation: 'Uno, dos, tres, cuatro, cinco',
          phonetic: '/wʌn tuː θriː fɔːr faɪv/',
          tips: '"Three" usa el sonido "th" como en "think".',
        },
        {
          id: 'n1_e2',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Repite los números del 6 al 10:',
          phrase: 'Six, seven, eight, nine, ten',
          translation: 'Seis, siete, ocho, nueve, diez',
          phonetic: '/sɪks ˈsɛvən eɪt naɪn tɛn/',
          tips: '"Eight" se pronuncia como "ate" (comió).',
        },
        {
          id: 'n1_e3',
          type: EXERCISE_TYPES.READ_ALOUD,
          instruction: 'Lee esta secuencia en voz alta:',
          phrase: 'I have three cats and two dogs.',
          translation: 'Tengo tres gatos y dos perros.',
          phonetic: '/aɪ hæv θriː kæts ænd tuː dɒɡz/',
          tips: 'Asegúrate de pronunciar la "s" final en "cats" y "dogs".',
        },
      ],
    },
    {
      id: 'num_l2',
      topicId: 'numbers',
      lessonNumber: 2,
      title: 'Números del 11 al 100',
      exercises: [
        {
          id: 'n2_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Repite los números especiales:',
          phrase: 'Eleven, twelve, thirteen, fourteen, fifteen',
          translation: 'Once, doce, trece, catorce, quince',
          phonetic: '/ɪˈlɛvən twɛlv θɜːˈtiːn ˈfɔːrtiːn ˈfɪftiːn/',
          tips: 'Los terminados en "-teen" tienen el acento en la segunda sílaba.',
        },
      ],
    },
  ],
  food: [
    {
      id: 'food_l1',
      topicId: 'food',
      lessonNumber: 1,
      title: 'Ordenar en un restaurante',
      exercises: [
        {
          id: 'f1_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Practica esta orden en un restaurante:',
          phrase: 'I would like a coffee and a sandwich, please.',
          translation: 'Quisiera un café y un sándwich, por favor.',
          phonetic: '/aɪ wʊd laɪk ə ˈkɒfi ænd ə ˈsænwɪdʒ pliːz/',
          tips: '"Would like" es más educado que "want" para hacer pedidos.',
        },
        {
          id: 'f1_e2',
          type: EXERCISE_TYPES.CONVERSATION,
          instruction: 'Practica esta conversación en el restaurante:',
          phrase: 'What would you recommend? What is the special today?',
          translation: '¿Qué recomiendas? ¿Cuál es el especial de hoy?',
          phonetic: '/wɒt wʊd juː ˌrɛkəˈmɛnd wɒt ɪz ðə ˈspɛʃəl təˈdeɪ/',
          tips: 'Practica la entonación de las preguntas con tono ascendente.',
        },
      ],
    },
  ],
  travel: [
    {
      id: 'travel_l1',
      topicId: 'travel',
      lessonNumber: 1,
      title: 'En el aeropuerto',
      exercises: [
        {
          id: 't1_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Repite estas frases del aeropuerto:',
          phrase: 'Where is the check-in counter for flight BA204?',
          translation: '¿Dónde está el mostrador de facturación del vuelo BA204?',
          phonetic: '/wɛər ɪz ðə tʃɛkɪn ˈkaʊntər fɔːr flaɪt biː eɪ tuː əʊ fɔːr/',
          tips: '"Check-in" tiene el acento en la primera sílaba.',
        },
      ],
    },
  ],
  debate: [
    {
      id: 'debate_l1',
      topicId: 'debate',
      lessonNumber: 1,
      title: 'Expresar acuerdo y desacuerdo',
      exercises: [
        {
          id: 'd1_e1',
          type: EXERCISE_TYPES.LISTEN_REPEAT,
          instruction: 'Practica expresar tu opinión:',
          phrase: 'In my opinion, technology has improved our lives significantly.',
          translation: 'En mi opinión, la tecnología ha mejorado nuestras vidas significativamente.',
          phonetic: '/ɪn maɪ əˈpɪnjən tɛkˈnɒlədʒi hæz ɪmˈpruːvd aʊər laɪvz sɪɡˈnɪfɪkəntli/',
          tips: 'Usa pausas naturales entre las frases largas.',
        },
        {
          id: 'd1_e2',
          type: EXERCISE_TYPES.CONVERSATION,
          instruction: 'Debate este tema con el chatbot:',
          phrase: 'I strongly believe that education should be free for everyone.',
          translation: 'Creo firmemente que la educación debería ser gratuita para todos.',
          phonetic: '/aɪ ˈstrɒŋli bɪˈliːv ðæt ˌɛdjʊˈkeɪʃən ʃʊd biː friː fɔːr ˈɛvrɪwʌn/',
          tips: 'Enfatiza "strongly" y "free" para dar más fuerza a tu argumento.',
        },
      ],
    },
  ],
};

export function getLessonsForTopic(topicId) {
  return EXERCISES_BY_TOPIC[topicId] || [];
}

export function getLessonById(topicId, lessonId) {
  const lessons = getLessonsForTopic(topicId);
  return lessons.find((l) => l.id === lessonId) || null;
}

export function getExerciseById(topicId, lessonId, exerciseId) {
  const lesson = getLessonById(topicId, lessonId);
  if (!lesson) return null;
  return lesson.exercises.find((e) => e.id === exerciseId) || null;
}
