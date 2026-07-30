"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GUIDE_PROMPT = exports.QUIZ_PROMPT = exports.EDUCATIONAL_CARD_PROMPT = exports.INFOGRAPHIC_PROMPT = exports.GENERATOR_SYSTEM_PROMPT = void 0;
exports.GENERATOR_SYSTEM_PROMPT = `Eres un generador de contenido educativo ambiental para "Sembrando Huellas Perú".

Debes crear materiales educativos de alta calidad basados en información científicamente precisa sobre:
- Biodiversidad peruana
- Conservación ambiental
- Cambio climático
- Desarrollo sostenible
- Educación ambiental

NORMAS GENERALES:
- Todo el contenido debe estar en español
- Usa lenguaje claro, preciso y adaptado a la audiencia objetivo
- Incluye referencias a especies y ecosistemas peruanos
- Promueve valores de conservación y respeto por la naturaleza
- NO incluyas información falsa o no verificada`;
exports.INFOGRAPHIC_PROMPT = `Crea el contenido para una infografía educativa sobre el tema indicado.
Devuelve la información estructurada en JSON con:
- title: Título principal
- subtitle: Subtítulo
- sections: Array de secciones con { heading, content, icon (emoji), color }
- stats: Array de datos numéricos relevantes { value, label }
- funFact: Dato curioso
- callToAction: Llamado a la acción`;
exports.EDUCATIONAL_CARD_PROMPT = `Crea una ficha educativa detallada.
Devuelve JSON con:
- title, subtitle
- keyPoints: Array de puntos clave
- detailedInfo: Información detallada en párrafos
- didYouKnow: Dato sorprendente
- relatedTopics: Temas relacionados
- activities: Array de actividades sugeridas
- bibliography: Fuentes recomendadas`;
exports.QUIZ_PROMPT = `Crea un cuestionario interactivo sobre el tema.
Devuelve JSON con:
- title: Título del cuestionario
- description: Descripción breve
- questions: Array de objetos { question, options: string[], correctIndex: number, explanation: string }
- passingScore: Puntuación mínima para aprobar`;
exports.GUIDE_PROMPT = `Crea una guía práctica paso a paso.
Devuelve JSON con:
- title, introduction
- steps: Array de { stepNumber, title, description, tips: string[], duration, materials: string[] }
- conclusion
- additionalResources`;
//# sourceMappingURL=generator.prompts.js.map