---
name: Industrial Glass UI
description: Definición del diseño visual 'Industrial Premium' para la interfaz de usuario.
---

# Estilo Visual: Industrial Premium

Este documento guía la estética visual del proyecto, buscando evocar robustez, modernidad y exclusividad.

## 1. Paleta de Colores

- **Fondo Principal**: `#0F0F0F` (Negro Profundo / Carbón). Evitar el negro absoluto (#000000) para reducir fatiga visual.
- **Texturas**: Uso sutil de patrones de fibra de carbono o metal cepillado en fondos de secciones grandes.

## 2. Componentes UI: Glassmorphism Metálico

Combinamos la elegancia del vidrio con la dureza del metal.

- **Tarjetas y Contenedores**:
    - **Fondo**: Translúcido con desenfoque (`backdrop-filter: blur(12px)`).
    - **Color Base**: Blanco o Gris con muy baja opacidad (ej. `bg-zinc-900/40`).
    - **Bordes**: Metálicos y brillantes.
        - *Borde*: `1px solid`
        - *Color Borde*: Gradientes sutiles de gris/plateado o `border-white/10` para simular borde mecanizado.

## 3. Acentos y CTAs (Call to Actions)

Los elementos interactivos deben destacar sobre el esquema oscuro.

- **Naranja Mecánico**: `#FF6600`
    - Uso: Botones principales (Reservar, Solicitar Auxilio), Alertas importantes.
- **Verde Neón**:
    - Uso: Estado 'Listo', Indicadores de éxito, Botones de confirmación seguros.

## 4. Tipografía y Detalles

- Fuente sans-serif moderna y legible (ej. Inter, Roboto, o una monoespaciada para datos técnicos).
- Iconografía de trazo fino pero definido, estilo técnico.
