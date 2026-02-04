---
name: Supabase MCP Architect
description: Normas para la gestión de base de datos y autenticación utilizando Supabase MCP.
---

# Supabase MCP Architect

Este documento establece el protocolo para interactuar con la infraestructura de backend y datos.

## Protocolo Obligatorio: MCP First

**Instrucción Clave**: Todas las modificaciones estructurales a la base de datos deben realizarse a través del servidor MCP de Supabase.

1.  **Migraciones SQL**:
    - Nunca ejecutar SQL arbitrario directamente en producción si es posible evitarlo.
    - Usar herramientas MCP para generar y aplicar migraciones controladas.
    - **Validación**: Antes de crear una tabla o función, consultar el esquema actual para evitar duplicados o conflictos de nombres.

2.  **Row Level Security (RLS)**:
    - **Por Defecto**: Toda nueva tabla debe tener RLS habilitado (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`).
    - **Políticas**:
        - Definir explícitamente quién puede hacer SELECT, INSERT, UPDATE, DELETE.
        - *Ejemplo*: "Un usuario solo puede ver sus propios vehículos." -> `auth.uid() = user_id`.

3.  **Gestión de Usuarios**:
    - Utilizar Supabase Auth para toda la gestión de sesiones.
    - No almacenar contraseñas en tablas personalizadas.

## Flujo de Trabajo de Datos

1.  **Diseño**: Definir el modelo de datos en `task.md` o `implementation_plan.md`.
2.  **Generación**: Crear la migración SQL usando las herramientas del agente.
3.  **Aplicación**: Aplicar la migración vía MCP.
4.  **Verificación**: Confirmar que las tablas/columnas existen y tienen los permisos correctos.
