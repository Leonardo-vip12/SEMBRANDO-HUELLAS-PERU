# Environmental Intelligence Suite (EIS) - Arquitectura

## Visión General

La Environmental Intelligence Suite (EIS) es el ecosistema de inteligencia artificial de Sembrando Huellas Perú. Está diseñada como una capa modular sobre la infraestructura existente, proporcionando herramientas de IA para educación ambiental, ciencia ciudadana e innovación tecnológica.

## Principios de Diseño

1. **No acoplamiento a un único proveedor de IA** - Arquitectura multi-provider (OpenAI, Gemini, Claude, Local)
2. **Complemento humano** - La IA asiste, no reemplaza especialistas
3. **Preparación para el futuro** - Nuevos modelos y herramientas sin modificar arquitectura existente
4. **Estandarización científica** - Validación, fuentes, niveles de confianza en todas las respuestas

## Diagrama de Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Web     │  │  Mobile  │  │  Admin   │  │  API     │   │
│  │  (React) │  │  (Expo)  │  │  Panel   │  │  Cliente │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼──────────────┼──────────────┼──────────────┼────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
┌────────────────────────────────────────────────────────────┐
│                   AI GATEWAY (EIS)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ OpenAI   │  │  Gemini  │  │  Claude  │  │  Local   │  │
│  │  GPT-4   │  │  Pro 1.5 │  │  3 Sonnet│  │  Model   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Failover Automático + Load Balancing         │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────────┐
│                    EIS SERVICES                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────┐    │
│  │  Species ID │  │ Observatory │  │  Tutor IA      │    │
│  │  V2         │  │             │  │  Adaptativo    │    │
│  ├─────────────┤  ├─────────────┤  ├────────────────┤    │
│  │  Document   │  │  Activity   │  │  Certificates  │    │
│  │  Analysis   │  │  Planner    │  │  V2            │    │
│  ├─────────────┤  ├─────────────┤  ├────────────────┤    │
│  │  Analytics  │  │  RAG        │  │  Recommender   │    │
│  │  IA         │  │             │  │  Inteligente   │    │
│  └─────────────┘  └─────────────┘  └────────────────┘    │
└────────────────────────────────────────────────────────────┘
        │
        ├──────────────────────────────────────┐
        ▼                                      ▼
┌──────────────────┐                  ┌──────────────────┐
│   AI MODULE       │                  │   DATA LAYER     │
│  ┌────────────┐   │                  │  ┌────────────┐  │
│  │ Assistant  │   │                  │  │ PostgreSQL │  │
│  ├────────────┤   │                  │  │ (Prisma)   │  │
│  │ Generator  │   │                  │  ├────────────┤  │
│  ├────────────┤   │                  │  │  Redis     │  │
│  │ Translator │   │                  │  │  (Cache)   │  │
│  ├────────────┤   │                  │  ├────────────┤  │
│  │ Summarizer │   │                  │  │  MinIO     │  │
│  ├────────────┤   │                  │  │ (Archivos) │  │
│  │ RAG        │   │                  │  └────────────┘  │
│  │ VectorStore│   │                  └──────────────────┘
│  └────────────┘   │
└──────────────────┘
```

## Flujo de Datos

### Identificación de Especies
```
Usuario sube imagen → SpeciesV2Service → AiService.analyzeImage()
→ AI Provider (OpenAI/Gemini) → Parse JSON result
→ Enriquecer con especies similares de DB → Guardar en SpeciesIdentification
→ Devolver resultado + validación científica
```

### Tutor Adaptativo
```
Usuario envía consulta + nivel → TutorService
→ Seleccionar prompt según nivel (primaria/secundaria/...)
→ Buscar en KnowledgeBase (RAG) para contexto
→ AiService.chat() con prompt adaptado
→ Generar preguntas de seguimiento
→ Agregar disclaimer de validación
→ Devolver respuesta + fuentes + material sugerido
```

### Análisis de Documentos
```
Usuario sube archivo (PDF/Word/PPT/texto) → DocumentAnalysisService
→ Extraer texto del archivo
→ 6 llamadas IA en paralelo: resumen, conceptos, preguntas,
  mapa conceptual, glosario, actividades
→ Guardar en DocumentAnalysis
→ Devolver resultados estructurados
```

## Modelos de Datos (Prisma)

### EIS Models
| Modelo | Tabla | Propósito |
|--------|-------|-----------|
| `SpeciesIdentification` | species_identifications | Resultados de identificación de especies |
| `BiodiversityObservation` | biodiversity_observations | Observaciones de ciencia ciudadana |
| `DocumentAnalysis` | document_analyses | Análisis de documentos educativos |
| `ActivityPlan` | activity_plans | Planes de actividad generados por IA |
| `CertificateTemplate` | certificate_templates | Plantillas de certificados |
| `IssuedCertificate` | issued_certificates | Certificados emitidos con QR |
| `KnowledgeBase` | knowledge_base | Base de conocimiento con embeddings |
| `AiQueryLog` | ai_query_logs | Registro de consultas IA |

### UserLevel Enum
`PRIMARY | SECONDARY | UNIVERSITY | TEACHER | RESEARCHER | VOLUNTEER | COMPANY | GENERAL`

### ObservationStatus Enum
`PENDING | VERIFIED | REJECTED | NEEDS_REVIEW`

## Sistema de Prompts

Los prompts se almacenan en `src/modules/ai/prompts/`:

| Archivo | Propósito |
|---------|-----------|
| `assistant.prompts.ts` | Asistente general IA |
| `identifier.prompts.ts` | Identificación de especies (imagen) |
| `generator.prompts.ts` | Generación de contenido educativo |
| `news.prompts.ts` | Generación y resumen de noticias |
| `translator.prompts.ts` | Traducción (incluye quechua/aymara) |
| `summarizer.prompts.ts` | Resumen de textos |
| `certificate.prompts.ts` | Plantillas de certificados |
| `impact.prompts.ts` | Análisis de impacto |

Los prompts de nivel educativo para el tutor están en `tutor/tutor.service.ts`:
- **primaria**: Lenguaje simple, analogías, 2-3 oraciones
- **secundaria**: Términos científicos básicos, datos interesantes
- **universidad**: Terminología técnica, referencias académicas
- **docente**: Contenido estructurado para enseñanza
- **investigador**: Lenguaje científico preciso con referencias
- **voluntario**: Acciones prácticas y oportunidades
- **empresa**: Sostenibilidad corporativa y RSE
- **general**: Lenguaje claro y accesible

## Integraciones Futuras

1. **Nuevos proveedores IA** - Implementar IAIProvider interface
2. **Vector stores adicionales** - pgvector, Qdrant, Pinecone
3. **Modelos de visión** - Procesamiento de video para identificación
4. **Procesamiento de audio** - Transcripción y análisis de sonidos ambientales
5. **Análisis satelital** - Datos geoespaciales para monitoreo
6. **Blockchain** - Verificación descentralizada de certificados
7. **Gamificación** - Logros y badges por contribuciones

## Buenas Prácticas

1. **Provider Pattern** - Todos los proveedores IA implementan `IAIProvider`
2. **Gateway Pattern** - Failover automático entre proveedores
3. **Factory Pattern** - Creación de providers y vector stores
4. **Interceptor Pattern** - Logging y cost tracking automático
5. **DTO Validation** - class-validator en todos los endpoints
6. **Versioning** - Knowledge base con versionado de entradas
7. **Audit Trail** - Todas las consultas IA quedan registradas
8. **Safe Fallbacks** - Cada servicio tiene fallback cuando IA no está disponible
9. **Confidence Levels** - Toda respuesta incluye nivel de confianza
10. **Scientific Validation** - Revisión humana antes de contenido oficial
