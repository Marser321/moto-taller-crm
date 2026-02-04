---
name: Deep Audit Mechanic
description: Checklist y procedimientos para auditoría de código, seguridad y optimización.
---

# Deep Audit Mechanic

Este documento sirve como guía para las sesiones de "auditoría profunda" del código, enfocándose en seguridad, rendimiento y lógica crítica.

## Checklist de Auditoría

### 1. Seguridad (Frontend & Backend)

- [ ] **API Keys**: Verificar que ninguna clave de servicio privada (SERVICE_ROLE_KEY) esté expuesta en el código del cliente (archivos con `"use client"` o expuestos al navegador). Solo `NEXT_PUBLIC_SUPABASE_ANON_KEY` debe ser visible.
- [ ] **RLS Leaks**: Verificar que las consultas a la base de datos no retornen datos de otros usuarios indebidamente. Probar con usuarios diferentes.
- [ ] **Inputs**: Validar y sanitizar todas las entradas de usuario en formularios para prevenir inyecciones o malformaciones.

### 2. Lógica de Negocio Crítica

- [ ] **Transacciones Atómicas**:
    - *Caso Crítico*: Descuento de auxilios.
    - Verificar que la operación de restar 1 auxilio al confirmar un servicio sea atómica y maneje condiciones de carrera (race conditions).
    - Confirmar que se valida `auxilios > 0` en el servidor, no solo en el frontend.

### 3. Rendimiento (React/Next.js)

- [ ] **Re-renderizados**: Identificar componentes que se renderizan excesivamente sin cambios en sus props. Usar `React.memo` o refactorizar el estado si es necesario.
- [ ] **Carga de Datos**: Verificar que no existan cascadas de peticiones (waterfalls) innecesarias. Usar Promise.all o patrones de carga paralela donde aplique.
- [ ] **Imágenes**: Confirmar uso de `next/image` con tamaños y formatos adecuados.

## Procedimiento de Reporte

Si se encuentra una vulnerabilidad o error crítico:
1.  **Detener** el desarrollo de nuevas features.
2.  **Documentar** el hallazgo en un 'Security/Bug Alert'.
3.  **Proponer** el fix inmediato.
4.  **Verificar** la solución.
