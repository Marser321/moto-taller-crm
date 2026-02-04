# Skill: Supabase MCP Architect
## Propósito
Gestionar la base de datos y lógica de negocio usando el servidor MCP de Supabase.

## Reglas de Negocio (Fede Moto)
1. **Suscripciones:** Tabla `subscriptions` vinculada a `users`. Controla el límite de 3 auxilios/mes.
2. **Auxilios:** Al crear un auxilio, usar una *Database Function* `request_aid()` que verifique saldo > 0 y reste 1.
3. **Seguridad:** Siempre habilitar RLS (Row Level Security). El usuario solo ve sus motos.

## Flujo de Trabajo
- No inventes código SQL manual si puedes usar la herramienta MCP `create_table` o `run_query`.
- Antes de crear una tabla, verifica si ya existe con `get_schema`.
