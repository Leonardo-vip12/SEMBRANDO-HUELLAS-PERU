# Modo Offline - Sembrando Huellas Perú

## Arquitectura de Sincronización

```
[App Móvil]                          [API Backend]
     |                                     |
     |  ┌─────────────────────────┐        |
     |  │     SQLite Local DB     │        |
     |  │  ┌───────────────────┐  │        |
     |  │  │ sync_queue        │──│──POST──→
     |  │  │ observation_drafts│  │        |
     |  │  │ downloaded_content│  │        |
     |  │  │ favorites         │  │        |
     |  │  │ gamification      │  │        |
     |  │  └───────────────────┘  │        |
     |  │           │             │        |
     |  │  NetInfo  │             │        |
     |  │  Listener │◄────────────│        |
     |  └───────────┼─────────────┘        |
     |              │                      |
     └──────────────┼──────────────────────┘
                    │
            [Cola de Sincronización]
            • Procesa en orden FIFO
            • Máximo 10 items por lote
            • Reintentos automáticos
            • Límite de 3 reintentos
```

## Tablas SQLite

| Tabla | Propósito | Columnas |
|-------|-----------|----------|
| `sync_queue` | Cola de operaciones offline | id, endpoint, method, body, created_at, retries |
| `observation_drafts` | Borradores de observaciones | id, data (JSON), updated_at |
| `downloaded_content` | Contenido descargado para offline | id, type, data (JSON), downloaded_at |
| `favorites` | Favoritos del usuario | item_id, type, created_at |
| `gamification` | Datos de gamificación | key, value (JSON) |

## Flujo Offline

### Registro de Observación sin Conexión
1. Usuario llena formulario de observación
2. App verifica conectividad (NetInfo)
3. Si está offline → guarda en `observation_drafts`
4. Agrega a `sync_queue` con endpoint/method/body
5. Muestra mensaje "Guardado localmente"
6. Cuando restaura conexión → `processSyncQueue()` ejecuta POST
7. Si éxito → elimina de sync_queue
8. Si falla → incrementa retries (máx 3)

### Contenido Descargado
- Biblioteca: PDFs, infografías, guías
- Especies: fichas completas
- Cursos: materiales y evaluaciones

## Buenas Prácticas

1. **Siempre verificar conectividad** antes de llamadas API
2. **Guardar borradores** en SQLite antes de intentar sync
3. **Procesar cola** al recuperar conexión
4. **Límite de reintentos** (3) para evitar bucles infinitos
5. **Feedback visual** al usuario sobre estado offline
6. **Compresión de imágenes** antes de subir (calidad 0.7)
7. **Cache de consultas** TanStack Query con staleTime 5min
