---
name: Moto Shop Business Logic
description: Lógica de negocio y reglas para la gestión del taller mecánico y suscripciones.
---

# Lógica de Negocio: Fede Moto Servicios

Este documento define las reglas de oro para la operación del negocio, incluyendo la gestión de suscripciones de auxilio y el flujo de trabajo del taller.

## 1. Suscripción de Auxilio

El modelo de suscripción es fundamental para asegurar ingresos recurrentes y fidelidad.

- **Beneficio**: El usuario paga una cuota mensual que le otorga derecho a **3 auxilios mecánicos** por mes.
- **Tipos de Auxilio**:
    - Grúa (traslado).
    - Mecánica ligera in-situ (batería, pinchazo simple, etc.).
- **Validación Crítica**:
    - Antes de permitir una solicitud de auxilio, el sistema **DEBE** validar:
      ```typescript
      if (usuario.auxilios_restantes > 0) {
          // Permitir solicitud
      } else {
          // Bloquear y ofrecer pago extra o renovación
      }
      ```
    - El contador se debe decrementar atómicamente al confirmar el servicio.

## 2. Gestión de Citas

La integridad de la agenda es prioritaria para evitar conflictos físicos en el taller.

- **Regla de Unicidad**: Un vehículo (identificado por Matrícula o ID) **NO** puede tener dos citas activas (estados no finalizados) en el mismo rango horario.
- **Validación**:
    - Al crear una cita: Verificar si existe conflicto de horario para ese vehículo O para el mecánico asignado (si se implementa asignación específica).

## 3. Estados de Reparación

El ciclo de vida de una reparación debe seguir estrictamente este flujo para mantener el orden y la comunicación con el cliente.

1.  **Ingresado**: El vehículo llega al taller y se abre la orden.
2.  **Diagnóstico**: El mecánico revisa el vehículo para determinar el problema y presupuesto.
3.  **En Espera de Repuestos**: El trabajo está pausado esperando piezas.
4.  **En Reparación**: El mecánico está trabajando activamente en la moto.
5.  **Listo**: El trabajo ha finalizado, la moto está probada y lista para retiro. (Dispara notificación al cliente).
6.  **Entregado**: El cliente ha retirado el vehículo y pagado/cerrado la orden.

> **Nota**: Cada cambio de estado debe registrarse con fecha y hora para auditoría.
