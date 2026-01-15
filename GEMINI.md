Actúa como un Arquitecto de Software experto en No-Code y automatizaciones. Voy a desarrollar una aplicación para la gestión interna de un taller mecánico utilizando Google AppSheet como frontend/database y n8n (self-hosted) para las automatizaciones.

El contexto del negocio: El taller vende un servicio de 'Auxilio Mecánico' (suscripción anual). Incluye 3 traslados/eventos al año con un límite de km. Si se pasan del límite, pagan un extra por km. Necesito gestionar clientes, vehículos, vencimientos de suscripciones y el conteo de auxilios usados.

Requisitos técnicos:

Estructura de Datos (Google Sheets): Dime exactamente qué columnas necesito crear en las hojas de cálculo. Necesito tablas para: 'Clientes', 'Vehículos', 'Suscripciones', 'Historial_Auxilios' y 'Configuración_Precios'. Asegúrate de usar IDs únicos y referencias (Refs) entre tablas.

Lógica en AppSheet:

Necesito una 'Columna Virtual' que calcule cuántos auxilios le quedan al cliente.

Necesito una fórmula para calcular el costo extra si el kilometraje del traslado supera el límite del plan.

Una vista tipo 'Semáforo': Verde (Suscripción activa), Rojo (Vencida o sin auxilios).

Automatización con n8n:

Diseña el flujo lógico (paso a paso) para crear en n8n.

El disparador (Trigger) será un script en Google Apps Script o un Webhook desde AppSheet cuando una suscripción esté a 3 días de vencer.

La acción será enviar un mensaje de WhatsApp (asume que uso una API genérica HTTP Request). Redacta el template del mensaje de venta persuasivo para que renueven.

Entregable: Dame la estructura de tablas detallada, las fórmulas de AppSheet (expresiones) para los cálculos de kilometraje/saldo, y el JSON o pseudocódigo del flujo de n8n.