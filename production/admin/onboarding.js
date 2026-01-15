
const TOUR_STEPS = [
    {
        target: '#seccion-dashboard', // Puede ser el contenedor general si no hay un id específico visible
        title: '👋 ¡Bienvenido Admin!',
        text: 'Este es tu nuevo Panel de Control. Aquí podrás ver un resumen rápido de tus ingresos, turnos completados y estado de clientes.',
        position: 'center',
        preAction: () => verDashboard()
    },
    {
        target: '#dash-ingresos', // ID específico de la tarjeta
        title: '💰 Tus Ingresos',
        text: 'Visualiza el total facturado en el mes actual. Se actualiza automáticamente cada vez que generas una factura.',
        position: 'bottom',
        preAction: () => verDashboard()
    },
    {
        target: 'aside nav',
        title: '📂 Navegación',
        text: 'Usa este menú para cambiar entre el Dashboard, la lista completa de Clientes y la gestión de Vencimientos.',
        position: 'right',
        preAction: () => verDashboard()
    },
    {
        target: '#nav-turnos',
        title: '📅 Gestión de Turnos',
        text: 'Vamos a ver el tablero de trabajo. Aquí es donde organizarás el día a día del taller.',
        position: 'right',
        preAction: () => { }
    },
    {
        target: '#turnos-section', // El contenedor del kanban
        title: '✅ Tablero Kanban',
        text: 'Arrastra las tarjetas para cambiar el estado. De "Solicitados" a "Confirmados" y finalmente "Completados".',
        position: 'top',
        preAction: () => verSeccionTurnos()
    },
    {
        target: 'button[onclick="abrirModalTurno()"]', // Selector del botón Nuevo Turno en Kanban
        title: '➕ Nuevo Turno',
        text: '¿Llegó alguien al taller? Crea un turno manualmente desde aquí sin necesidad de que el cliente use la app.',
        position: 'bottom',
        preAction: () => verSeccionTurnos()
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
