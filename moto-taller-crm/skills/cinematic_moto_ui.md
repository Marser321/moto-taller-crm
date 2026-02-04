# Skill: Interfaz Cinemática para Motos
## Propósito
Crear interfaces inmersivas usando 'Scrollytelling' y efectos visuales de alto impacto para Fede Moto Servicios.

## Stack Visual
- **Framer Motion**: Para animaciones de entrada y salida suaves.
- **Canvas API**: Para secuencias de imágenes controladas por scroll (frame-by-frame).
- **Tailwind CSS**: Estilos utilitarios con enfoque en modo oscuro industrial.

## Reglas de Estilo "Mechanical Luxury"
1. **Paleta:** Fondo `Carbon Fiber` (#121212), Acentos `Racing Orange` (#FF4500) y `Neon Green` (#00FF00) para estados de "Salud".
2. **Glassmorphism Industrial:** Usa `backdrop-blur-xl` con bordes sutiles metálicos (`border-white/10`) para las tarjetas de información flotantes.
3. **Tipografía:** Fuentes anchas y técnicas como 'Eurostile' o 'Rajdhani'.

## Instrucción de Scrollytelling
Cuando se pida "animación de scroll", genera un componente React que:
1. Cargue una secuencia de imágenes (ej: `engine_001.webp` a `engine_100.webp`).
2. Mapee la posición del scroll (0% a 100%) al índice de la imagen.
3. Dibuje la imagen en un `<canvas>` fijo en el fondo.
4. Haga aparecer textos flotantes (tooltips) sobre las piezas de la moto en momentos clave del scroll.
