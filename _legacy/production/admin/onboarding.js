
const TOUR_STEPS = [
    {
        target: '#seccion-dashboard',
        title: '👋 ¡Bienvenido a Fede Moto Servicio!',
        text: 'Este es tu Panel de Control. Aquí ves un resumen de ingresos, turnos y estado de tus clientes. ¡Vamos a recorrer todas las funciones!',
        position: 'center',
        preAction: () => verDashboard()
    },
    {
        target: '#dash-ingresos',
        title: '💰 Ingresos del Mes',
        text: 'Monitorea cuánto facturaste este mes. Se actualiza automáticamente cada vez que generas una factura.',
        position: 'bottom',
        preAction: () => verDashboard()
    },
    {
        target: 'aside nav',
        title: '📂 Menú de Navegación',
        text: 'Desde aquí accedes a todas las secciones: Dashboard, lista de Clientes por estado, Gestión de Turnos y Facturas.',
        position: 'right',
        preAction: () => verDashboard()
    },
    {
        target: '#nav-todos',
        title: '👥 Lista de Clientes',
        text: 'Aquí ves TODOS tus clientes registrados. Podés filtrar por estado: Por Vencer (amarillo) o Vencidos (rojo).',
        position: 'right',
        preAction: () => verDashboard()
    },
    {
        target: '#nav-turnos',
        title: '📅 Gestión de Turnos',
        text: 'El corazón del taller. Aquí organizas el día a día con un tablero visual estilo Kanban.',
        position: 'right',
        preAction: () => { }
    },
    {
        target: '#turnos-section',
        title: '✅ Tablero Kanban',
        text: 'Tres columnas: Solicitados → Confirmados → Completados. Los clientes solicitan, vos confirmás, y cuando terminás marcás como completado.',
        position: 'top',
        preAction: () => verSeccionTurnos()
    },
    {
        target: 'button[onclick="abrirModalTurno()"]',
        title: '➕ Crear Turno Manual',
        text: '¿Llegó alguien al taller sin reservar? Creá un turno desde acá directamente, sin que el cliente use la app.',
        position: 'bottom',
        preAction: () => verSeccionTurnos()
    },
    {
        target: '#btn-archived',
        title: '📦 Ver Archivados',
        text: 'Los turnos completados podés archivarlos para mantener limpio el tablero. Acá podés ver el historial de trabajos realizados.',
        position: 'bottom',
        preAction: () => verSeccionTurnos()
    },
    {
        target: '#nav-facturas',
        title: '🧾 Gestión de Facturas',
        text: 'Generá facturas profesionales para tus clientes. Podés verlas, buscarlas y eliminarlas desde esta sección.',
        position: 'right',
        preAction: () => verSeccionTurnos()
    },
    {
        target: 'button[onclick="abrirModalCampaña()"]',
        title: '📢 Campañas WhatsApp',
        text: 'Enviá mensajes masivos a tus clientes. Ideal para recordatorios de vencimiento, ofertas especiales o cambios de horario.',
        position: 'bottom',
        preAction: () => verDashboard()
    },
    {
        target: '.fab-container',
        title: '❓ Ayuda Siempre Disponible',
        text: '¿Tenés dudas? Hacé clic acá para volver a ver este tutorial o contactar soporte por WhatsApp. ¡Éxitos con Fede Moto Servicio! 🏍️',
        position: 'top',
        preAction: () => verDashboard()
    }
];


let currentStep = 0;

function initOnboarding() {
    // Inject Overlay
    if (!document.querySelector('.tour-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'tour-overlay';
        document.body.appendChild(overlay);

        const card = document.createElement('div');
        card.id = 'tour-card';
        card.className = 'tour-card';
        document.body.appendChild(card);
    }

    // Auto-start check
    // if (!localStorage.getItem('moto_tour_completed')) {
    //     setTimeout(startTour, 1000);
    // }
}

function startTour() {
    currentStep = 0;
    document.querySelector('.tour-overlay').classList.add('active');
    renderStep();
}

function endTour() {
    document.querySelector('.tour-overlay').classList.remove('active');
    document.getElementById('tour-card').classList.remove('active');

    // Remove highlights
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    localStorage.setItem('moto_tour_completed', 'true');
}

function nextStep() {
    // Clean previous
    const prevFn = TOUR_STEPS[currentStep].target;
    if (prevFn && typeof prevFn === 'string') {
        const el = document.querySelector(prevFn);
        if (el) el.classList.remove('tour-highlight');
    }

    currentStep++;
    if (currentStep >= TOUR_STEPS.length) {
        endTour();
        return;
    }
    renderStep();
}

async function renderStep() {
    const step = TOUR_STEPS[currentStep];

    // Ejecutar acción previa (ej: cambiar de vista)
    if (step.preAction) {
        step.preAction();
        // Breve espera para renderizado
        await new Promise(r => setTimeout(r, 400));
    }

    const target = document.querySelector(step.target);
    const card = document.getElementById('tour-card');

    if (!target) {
        console.warn('Tour target not found:', step.target);
        nextStep();
        return;
    }

    // Highlight
    target.classList.add('tour-highlight');
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Posicionar Card
    const rect = target.getBoundingClientRect();
    const cardRect = { width: 320, height: 200 }; // Aproximado

    let top, left;

    if (step.position === 'center') {
        top = window.innerHeight / 2 - 100;
        left = window.innerWidth / 2 - 160;
    } else if (step.position === 'right') {
        top = rect.top;
        left = rect.right + 20;
    } else if (step.position === 'bottom') {
        top = rect.bottom + 20;
        left = rect.left + (rect.width / 2) - 160;
    } else if (step.position === 'top') {
        top = rect.top - 220;
        left = rect.left + (rect.width / 2) - 160;
    }

    // Bounds check simple
    if (left < 20) left = 20;
    if (left + 320 > window.innerWidth) left = window.innerWidth - 340;
    if (top < 20) top = 20;

    card.style.top = `${top}px`;
    card.style.left = `${left}px`;

    // Content
    card.innerHTML = `
        <div class="tour-title">
            <span class="material-symbols-outlined text-red-500">info</span>
            ${step.title}
        </div>
        <p class="tour-text">${step.text}</p>
        <div class="tour-footer">
            <span class="tour-steps">${currentStep + 1} / ${TOUR_STEPS.length}</span>
            <div class="flex gap-2">
                <button onclick="endTour()" class="tour-skip">Omitir</button>
                <button onclick="nextStep()" class="tour-btn">
                    ${currentStep === TOUR_STEPS.length - 1 ? 'Finalizar' : 'Siguiente'}
                </button>
            </div>
        </div>
    `;

    card.classList.add('active');
}

// Inicializar al cargar
window.addEventListener('load', initOnboarding);
