# 📱 Dashboard Mobile-First: Changelog

**Objetivo:** Optimizar la vista de cliente para dispositivos móviles, reduciendo el desorden visual y priorizando funciones críticas.

## 🛠️ Cambios Realizados

### 1. Reestructuración de Layout (Grid -> Flex Stack)
*   **Antes:** Diseño de grilla complexa de 12 columnas que se apilaba desordenadamente en móvil.
*   **Ahora:** Flujo vertical lineal (`flex-col`) con espaciado consistente (`space-y-6`).

### 2. Hero Section Contenida
*   **Problema:** La imagen de la moto ocupaba todo el fondo y dificultaba la lectura de textos.
*   **Solución:** Se creó una "Hero Card" con altura fija (`min-h-[160px]`), imagen recortada y opacidad ajustada para que el texto "YAMAHA R1M" y los KMs resalten.

### 3. Prioridad al Pánico
*   **Cambio:** El botón de "Solicitar Auxilio" se movió a una posición central y despejada, justo debajo de la moto. Es el elemento interactivo principal.

### 4. Navegación Táctil
*   **Mejora:** Las tarjetas de "Próximo Service" y "Suscripción" se organizaron en una grilla de 2 columnas (`grid-cols-2`), haciéndolas botones grandes y fáciles de pulsar (Thumb-friendly).

### 5. Estética "Dark App"
*   **Detalle:** Se ajustaron los fondos a tonos más oscuros (`bg-zinc-900/50`) para mejorar el contraste con la tipografía blanca y los acentos rojos.

---
*Este diseño está listo para ser probado en resoluciones móviles.*
