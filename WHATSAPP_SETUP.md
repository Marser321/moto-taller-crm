# WhatsApp API Setup Guide

## Arquitectura

```
┌─────────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Admin Panel   │────>│   n8n        │────>│   WAHA API      │
│   (Frontend)    │     │ (Workflows)  │     │  (WhatsApp)     │
└─────────────────┘     └──────────────┘     └─────────────────┘
         │                      │                     │
         │  POST /api/whatsapp  │   POST /sendText    │
         └──────────────────────┴─────────────────────┘
```

## 1. Iniciar Servicios

```bash
cd c:/Users/morer/OneDrive/Documentos/Fede
docker-compose up -d
```

## 2. Vincular WhatsApp (Primera vez)

1. Abrir: http://localhost:3000/api/screenshot?session=default
2. Escanear QR con WhatsApp del taller
3. Esperar confirmación "CONNECTED"

## 3. Importar Workflows en n8n

Ir a http://localhost:5679 → Import:

| Archivo | Función |
|---------|---------|
| `n8n_whatsapp_api.json` | Gateway para enviar mensajes |
| `n8n_recordatorios_auto.json` | Cron diario de recordatorios |
| `n8n_api_clientes_unificado.json` | API de clientes |
| `n8n_api_turnos.json` | API de turnos |

## 4. Probar Envío

```bash
curl -X POST http://localhost:5679/webhook/api/whatsapp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "59899123456", "message": "Test desde CRM!"}'
```

## Fallback Automático

Si WAHA está offline, el sistema abre automáticamente `wa.me` como fallback.

## Endpoints WAHA Útiles

| Endpoint | Uso |
|----------|-----|
| `GET /api/sessions` | Ver sesiones activas |
| `GET /api/screenshot?session=default` | Ver QR / estado |
| `POST /api/sendText` | Enviar mensaje |
| `POST /api/startSession` | Iniciar sesión |
